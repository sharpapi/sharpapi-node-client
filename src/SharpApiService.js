const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { URL } = require('url');

const { JobDescriptionParameters } = require('./Dto/JobDescriptionParameters');
const { SharpApiJob } = require('./Dto/SharpApiJob');
const { SharpApiSubscriptionInfo } = require('./Dto/SharpApiSubscriptionInfo');
const { SharpApiJobStatusEnum } = require('./Enums/SharpApiJobStatusEnum');
const { SharpApiJobTypeEnum } = require('./Enums/SharpApiJobTypeEnum');

/**
 * Main Service to dispatch AI jobs to SharpAPI.com
 */
class SharpApiService {
  /**
   * Initializes a new instance of the class.
   *
   * @param {string} apiKey - Your SharpAPI API key.
   * @param {string} [apiBaseUrl] - The base URL for the API.
   * @param {string} [userAgent] - Custom User-Agent string.
   */
  constructor(apiKey, apiBaseUrl = 'https://sharpapi.com/api/v1', userAgent = 'SharpAPINodeClient/1.2.0') {
    if (!apiKey) {
      throw new Error('API key is required.');
    }
    this.apiKey = apiKey;
    this.apiBaseUrl = apiBaseUrl;
    this.userAgent = userAgent;

    this.apiJobStatusPollingInterval = 10; // seconds
    this.useCustomInterval = false;
    this.apiJobStatusPollingWait = 180; // seconds
  }

  // Headers for API requests
  getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'User-Agent': this.userAgent,
    };
  }

  /**
   * Generic request method to run axios client
   *
   * @param {string} method - HTTP method.
   * @param {string} url - API endpoint.
   * @param {object} data - Data to send.
   * @param {string} [filePath] - File path for file uploads.
   * @returns {Promise<object>} - Response data.
   */
  async makeRequest(method, url, data = {}, filePath = null) {
    const fullUrl = `${this.apiBaseUrl}${url}`;
    const headers = this.getHeaders();

    if (method === 'POST') {
      if (filePath) {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
        return axios.post(fullUrl, formData, {
          headers: {
            ...headers,
            ...formData.getHeaders(),
          },
        });
      } else {
        return axios.post(fullUrl, data, { headers });
      }
    } else {
      return axios.get(fullUrl, { headers, params: data });
    }
  }

  parseStatusUrl(response) {
    return response.data.status_url;
  }

  /**
   * Generic method to check job status in polling mode and then fetch results of the dispatched job
   *
   * @param {string} statusUrl - The URL to check job status.
   * @returns {Promise<SharpApiJob>} - The job result.
   */
  async fetchResults(statusUrl) {
    let waitingTime = 0;
    let response;

    while (true) {
      response = await axios.get(statusUrl, { headers: this.getHeaders() });
      const jobStatus = response.data.data.attributes;

      if (
        jobStatus.status === SharpApiJobStatusEnum.SUCCESS ||
        jobStatus.status === SharpApiJobStatusEnum.FAILED
      ) {
        break;
      }

      let retryAfter = parseInt(response.headers['retry-after'], 5) || this.apiJobStatusPollingInterval;

      if (this.useCustomInterval) {
        retryAfter = this.apiJobStatusPollingInterval;
      }

      waitingTime += retryAfter;

      if (waitingTime >= this.apiJobStatusPollingWait) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    }

    const data = response.data.data;
    const url = new URL(statusUrl);

    let result;
    if (url.pathname.split('/').length === 5) {
      result = data.attributes.result;
    } else {
      result = data.attributes.result;
    }

    return new SharpApiJob(
      data.id,
      data.attributes.type,
      data.attributes.status,
      result || null
    );
  }

  /**
   * Simple PING endpoint to check the availability of the API and its internal time zone (timestamp).
   *
   * @returns {Promise<object>} - Ping response.
   */
  async ping() {
    const response = await this.makeRequest('GET', '/ping');
    return response.data;
  }

  /**
   * Endpoint to check details regarding the subscription's current period.
   *
   * @returns {Promise<SharpApiSubscriptionInfo|null>} - Subscription info.
   */
  async quota() {
    const response = await this.makeRequest('GET', '/quota');
    const info = response.data;

    if (!info.timestamp) {
      return null;
    }

    return new SharpApiSubscriptionInfo(info);
  }

  /**
   * Parses a resume (CV) file from multiple formats (PDF/DOC/DOCX/TXT/RTF)
   * and returns an extensive JSON object of data points.
   *
   * An optional language parameter can also be provided (`English` value is set as the default one).
   *
   * @param {string} filePath - The path to the resume file.
   * @param {string|null} language - The language of the resume file. Defaults to 'English'.
   * @returns {Promise<string>} - The status URL.
   */
  async parseResume(filePath, language = null) {
    const data = {};
    if (language) {
      data.language = language;
    }
    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.HR_PARSE_RESUME.url, data, filePath);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a job description based on a set of parameters
   * provided via JobDescriptionParameters DTO object.
   * This endpoint provides concise job details in the response format,
   * including the short description, job requirements, and job responsibilities.
   *
   * Only the job position `name` parameter is required inside jobDescriptionParameters.
   *
   * @param {JobDescriptionParameters} jobDescriptionParameters
   * @returns {Promise<string>} - The status URL.
   */
  async generateJobDescription(jobDescriptionParameters) {
    const data = jobDescriptionParameters.toJSON();
    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.HR_JOB_DESCRIPTION.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a list of related skills with their weights as a float value (1.0-10.0)
   * where 10 equals 100%, the highest relevance score.
   *
   * @param {string} skillName
   * @param {string|null} language
   * @param {number|null} maxQuantity
   * @returns {Promise<string>} - The status URL.
   */
  async relatedSkills(skillName, language = null, maxQuantity = null) {
    const data = { content: skillName };
    if (language) data.language = language;
    if (maxQuantity) data.max_quantity = maxQuantity;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.HR_RELATED_SKILLS.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a list of related job positions with their weights as float value (1.0-10.0)
   * where 10 equals 100%, the highest relevance score.
   *
   * @param {string} jobPositionName
   * @param {string|null} language
   * @param {number|null} maxQuantity
   * @returns {Promise<string>} - The status URL.
   */
  async relatedJobPositions(jobPositionName, language = null, maxQuantity = null) {
    const data = { content: jobPositionName };
    if (language) data.language = language;
    if (maxQuantity) data.max_quantity = maxQuantity;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.HR_RELATED_JOB_POSITIONS.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Parses the customer's product review and provides its sentiment (POSITIVE/NEGATIVE/NEUTRAL)
   * with a score between 0-100%. Great for sentiment report processing for any online store.
   *
   * @param {string} review
   * @returns {Promise<string>} - The status URL.
   */
  async productReviewSentiment(review) {
    const data = { content: review };
    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.ECOMMERCE_REVIEW_SENTIMENT.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a list of suitable categories for the product with relevance weights as a float value (1.0-10.0)
   * where 10 equals 100%, the highest relevance score. Provide the product name and its parameters
   * to get the best category matches possible. Comes in handy with populating
   * product catalogue data and bulk products' processing.
   *
   * @param {string} productName
   * @param {string|null} language
   * @param {number|null} maxQuantity
   * @param {string|null} voiceTone
   * @param {string|null} context
   * @returns {Promise<string>} - The status URL.
   */
  async productCategories(productName, language = null, maxQuantity = null, voiceTone = null, context = null) {
    const data = { content: productName };
    if (language) data.language = language;
    if (maxQuantity) data.max_quantity = maxQuantity;
    if (voiceTone) data.voice_tone = voiceTone;
    if (context) data.context = context;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.ECOMMERCE_PRODUCT_CATEGORIES.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a shorter version of the product description.
   * Provide as many details and parameters of the product to get the best marketing introduction possible.
   * Comes in handy with populating product catalog data and bulk products processing.
   *
   * @param {string} productData
   * @param {string|null} language
   * @param {number|null} maxLength
   * @param {string|null} voiceTone
   * @returns {Promise<string>} - The status URL.
   */
  async generateProductIntro(productData, language = null, maxLength = null, voiceTone = null) {
    const data = { content: productData };
    if (language) data.language = language;
    if (maxLength) data.max_length = maxLength;
    if (voiceTone) data.voice_tone = voiceTone;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.ECOMMERCE_PRODUCT_INTRO.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a personalized thank-you email to the customer after the purchase.
   * The response content does not contain the title, greeting or sender info at the end,
   * so you can personalize the rest of the email easily.
   *
   * @param {string} productName
   * @param {string|null} language
   * @param {number|null} maxLength
   * @param {string|null} voiceTone
   * @param {string|null} context
   * @returns {Promise<string>} - The status URL.
   */
  async generateThankYouEmail(productName, language = null, maxLength = null, voiceTone = null, context = null) {
    const data = { content: productName };
    if (language) data.language = language;
    if (maxLength) data.max_length = maxLength;
    if (voiceTone) data.voice_tone = voiceTone;
    if (context) data.context = context;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.ECOMMERCE_THANK_YOU_EMAIL.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Parses the provided text for any phone numbers and returns the original detected version and its E.164 format.
   * Might come in handy in the case of processing and validating big chunks of data against phone numbers
   * or f.e. if you want to detect phone numbers in places where they're not supposed to be.
   *
   * @param {string} text
   * @returns {Promise<string>} - The status URL.
   */
  async detectPhones(text) {
    const data = { content: text };
    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.CONTENT_DETECT_PHONES.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Parses the provided text for any possible emails. Might come in handy in case of processing and validating
   * big chunks of data against email addresses or f.e. if you want to detect emails in places
   * where they're not supposed to be.
   *
   * @param {string} text
   * @returns {Promise<string>} - The status URL.
   */
  async detectEmails(text) {
    const data = { content: text };
    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.CONTENT_DETECT_EMAILS.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Parses the provided text for any possible spam content.
   *
   * @param {string} text
   * @returns {Promise<string>} - The status URL.
   */
  async detectSpam(text) {
    const data = { content: text };
    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.CONTENT_DETECT_SPAM.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a summarized version of the provided content.
   * Perfect for generating marketing introductions of longer texts.
   *
   * @param {string} text
   * @param {string|null} language
   * @param {number|null} maxLength
   * @param {string|null} voiceTone
   * @param {string|null} context
   * @returns {Promise<string>} - The status URL.
   */
  async summarizeText(text, language = null, maxLength = null, voiceTone = null, context = null) {
    const data = { content: text };
    if (language) data.language = language;
    if (maxLength) data.max_length = maxLength;
    if (voiceTone) data.voice_tone = voiceTone;
    if (context) data.context = context;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.CONTENT_SUMMARIZE.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a list of unique keywords/tags based on the provided content.
   *
   * @param {string} text
   * @param {string|null} language
   * @param {number|null} maxQuantity
   * @param {string|null} voiceTone
   * @param {string|null} context
   * @returns {Promise<string>} - The status URL.
   */
  async generateKeywords(text, language = null, maxQuantity = null, voiceTone = null, context = null) {
    const data = { content: text };
    if (language) data.language = language;
    if (maxQuantity) data.max_quantity = maxQuantity;
    if (voiceTone) data.voice_tone = voiceTone;
    if (context) data.context = context;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.CONTENT_KEYWORDS.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Translates the provided text into selected language.
   * Perfect for generating marketing introductions of longer texts.
   *
   * @param {string} text
   * @param {string} language
   * @param {string|null} voiceTone
   * @param {string|null} context
   * @returns {Promise<string>} - The status URL.
   */
  async translate(text, language, voiceTone = null, context = null) {
    const data = { content: text, language };
    if (voiceTone) data.voice_tone = voiceTone;
    if (context) data.context = context;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.CONTENT_TRANSLATE.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a paraphrased version of the provided text.
   *
   * @param {string} text
   * @param {string|null} language
   * @param {number|null} maxLength
   * @param {string|null} voiceTone
   * @param {string|null} context
   * @returns {Promise<string>} - The status URL.
   */
  async paraphrase(text, language = null, maxLength = null, voiceTone = null, context = null) {
    const data = { content: text };
    if (language) data.language = language;
    if (maxLength) data.max_length = maxLength;
    if (voiceTone) data.voice_tone = voiceTone;
    if (context) data.context = context;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.CONTENT_PARAPHRASE.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Proofreads (and checks grammar) of the provided text.
   *
   * @param {string} text
   * @returns {Promise<string>} - The status URL.
   */
  async proofread(text) {
    const data = { content: text };
    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.CONTENT_PROOFREAD.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates all most important META tags based on the content provided.
   * Make sure to include link to the website and pictures URL to get as many tags populated as possible.
   *
   * @param {string} text
   * @param {string|null} language
   * @param {string|null} voiceTone
   * @returns {Promise<string>} - The status URL.
   */
  async generateSeoTags(text, language = null, voiceTone = null) {
    const data = { content: text };
    if (language) data.language = language;
    if (voiceTone) data.voice_tone = voiceTone;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.SEO_GENERATE_TAGS.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Parses the Travel/Hospitality product review and provides its sentiment (POSITIVE/NEGATIVE/NEUTRAL)
   * with a score between 0-100%. Great for sentiment report processing for any online store.
   *
   * @param {string} text
   * @returns {Promise<string>} - The status URL.
   */
  async travelReviewSentiment(text) {
    const data = { content: text };
    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.TTH_REVIEW_SENTIMENT.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a list of suitable categories for the Tours & Activities product
   * with relevance weights as float value (1.0-10.0) where 10 equals 100%, the highest relevance score.
   * Provide the product name and its parameters to get the best category matches possible.
   * Comes in handy with populating product catalogue data and bulk product processing.
   *
   * @param {string} productName
   * @param {string|null} city
   * @param {string|null} country
   * @param {string|null} language
   * @param {number|null} maxQuantity
   * @param {string|null} voiceTone
   * @param {string|null} context
   * @returns {Promise<string>} - The status URL.
   */
  async toursAndActivitiesProductCategories(productName, city = null, country = null, language = null, maxQuantity = null, voiceTone = null, context = null) {
    const data = { content: productName };
    if (city) data.city = city;
    if (country) data.country = country;
    if (language) data.language = language;
    if (maxQuantity) data.max_quantity = maxQuantity;
    if (voiceTone) data.voice_tone = voiceTone;
    if (context) data.context = context;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.TTH_TA_PRODUCT_CATEGORIES.url, data);
    return this.parseStatusUrl(response);
  }

  /**
   * Generates a list of suitable categories for the Hospitality type product
   * with relevance weights as float value (1.0-10.0) where 10 equals 100%, the highest relevance score.
   * Provide the product name and its parameters to get the best category matches possible.
   * Comes in handy with populating products catalogs data and bulk products' processing.
   *
   * @param {string} productName
   * @param {string|null} city
   * @param {string|null} country
   * @param {string|null} language
   * @param {number|null} maxQuantity
   * @param {string|null} voiceTone
   * @param {string|null} context
   * @returns {Promise<string>} - The status URL.
   */
  async hospitalityProductCategories(productName, city = null, country = null, language = null, maxQuantity = null, voiceTone = null, context = null) {
    const data = { content: productName };
    if (city) data.city = city;
    if (country) data.country = country;
    if (language) data.language = language;
    if (maxQuantity) data.max_quantity = maxQuantity;
    if (voiceTone) data.voice_tone = voiceTone;
    if (context) data.context = context;

    const response = await this.makeRequest('POST', SharpApiJobTypeEnum.TTH_HOSPITALITY_PRODUCT_CATEGORIES.url, data);
    return this.parseStatusUrl(response);
  }
}

module.exports = { SharpApiService };

