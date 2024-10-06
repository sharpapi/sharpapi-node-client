const { SharpApiService } = require('../src/SharpApiService');
const { SharpApiJobTypeEnum } = require('../src/Enums/SharpApiJobTypeEnum');
const axios = require('axios');

jest.mock('axios');

describe('SharpApiService', () => {
  let sharpApiService;
  const apiKey = 'test_api_key';

  beforeEach(() => {
    sharpApiService = new SharpApiService(apiKey);
  });

  test('should initialize with API key', () => {
    expect(sharpApiService.apiKey).toBe(apiKey);
  });

  test('should throw error if API key is missing', () => {
    expect(() => {
      new SharpApiService('');
    }).toThrow('API key is required.');
  });

  test('should make a GET request to /ping', async () => {
    const mockResponse = { data: { ping: 'pong', timestamp: '2024-10-06T12:00:00Z' } };
    axios.get.mockResolvedValue(mockResponse);

    const response = await sharpApiService.ping();

    expect(axios.get).toHaveBeenCalledWith(`${sharpApiService.apiBaseUrl}/ping`, { headers: sharpApiService.getHeaders(), params: {} });
    expect(response).toEqual(mockResponse.data);
  });

  test('should make a GET request to /quota', async () => {
    const mockResponse = {
      data: {
        timestamp: '2024-10-06T12:00:00Z',
        on_trial: false,
        trial_ends: '2024-11-06T12:00:00Z',
        subscribed: true,
        current_subscription_start: '2024-10-01T12:00:00Z',
        current_subscription_end: '2024-11-01T12:00:00Z',
        subscription_words_quota: 100000,
        subscription_words_used: 5000,
        subscription_words_used_percentage: 5,
      },
    };
    axios.get.mockResolvedValue(mockResponse);

    const response = await sharpApiService.quota();

    expect(axios.get).toHaveBeenCalledWith(`${sharpApiService.apiBaseUrl}/quota`, { headers: sharpApiService.getHeaders(), params: {} });
    expect(response.timestamp).toEqual(new Date('2024-10-06T12:00:00Z'));
    expect(response.subscription_words_used).toBe(5000);
  });

  test('should make a POST request to /ecommerce/product_categories', async () => {
    const mockStatusUrl = 'https://sharpapi.com/api/v1/job/status/12345';
    const mockResponse = { data: { status_url: mockStatusUrl } };
    axios.post.mockResolvedValue(mockResponse);

    const productName = 'Test Product';
    const statusUrl = await sharpApiService.productCategories(productName);

    expect(axios.post).toHaveBeenCalledWith(
      `${sharpApiService.apiBaseUrl}${SharpApiJobTypeEnum.ECOMMERCE_PRODUCT_CATEGORIES.url}`,
      { content: productName },
      { headers: sharpApiService.getHeaders() }
    );
    expect(statusUrl).toBe(mockStatusUrl);
  });

  test('should fetch job results', async () => {
    const statusUrl = 'https://sharpapi.com/api/v1/job/status/12345';
    const mockJobData = {
      data: {
        id: '12345',
        attributes: {
          type: SharpApiJobTypeEnum.ECOMMERCE_PRODUCT_CATEGORIES.value,
          status: 'success',
          result: { categories: ['Category1', 'Category2'] },
        },
      },
    };

    axios.get
      .mockResolvedValueOnce({
        data: {
          data: {
            attributes: {
              status: 'pending',
            },
          },
        },
        headers: { 'retry-after': '1' },
      })
      .mockResolvedValueOnce({
        data: mockJobData,
        headers: {},
      });

    const resultJob = await sharpApiService.fetchResults(statusUrl);

    expect(axios.get).toHaveBeenCalledWith(statusUrl, { headers: sharpApiService.getHeaders() });
    expect(resultJob.id).toBe('12345');
    expect(resultJob.status).toBe('success');
    expect(resultJob.result).toEqual({ categories: ['Category1', 'Category2'] });
  });

  // Additional tests for other methods...

  test('should make a POST request to /content/translate', async () => {
    const mockStatusUrl = 'https://sharpapi.com/api/v1/job/status/67890';
    const mockResponse = { data: { status_url: mockStatusUrl } };
    axios.post.mockResolvedValue(mockResponse);

    const text = 'Hello, world!';
    const language = 'French';
    const statusUrl = await sharpApiService.translate(text, language);

    expect(axios.post).toHaveBeenCalledWith(
      `${sharpApiService.apiBaseUrl}${SharpApiJobTypeEnum.CONTENT_TRANSLATE.url}`,
      { content: text, language },
      { headers: sharpApiService.getHeaders() }
    );
    expect(statusUrl).toBe(mockStatusUrl);
  });

  // Test the paraphrase method
  test('should make a POST request to /content/paraphrase', async () => {
    const mockStatusUrl = 'https://sharpapi.com/api/v1/job/status/78901';
    const mockResponse = { data: { status_url: mockStatusUrl } };
    axios.post.mockResolvedValue(mockResponse);

    const text = 'This is a test sentence.';
    const statusUrl = await sharpApiService.paraphrase(text);

    expect(axios.post).toHaveBeenCalledWith(
      `${sharpApiService.apiBaseUrl}${SharpApiJobTypeEnum.CONTENT_PARAPHRASE.url}`,
      { content: text },
      { headers: sharpApiService.getHeaders() }
    );
    expect(statusUrl).toBe(mockStatusUrl);
  });

  // Test the proofread method
  test('should make a POST request to /content/proofread', async () => {
    const mockStatusUrl = 'https://sharpapi.com/api/v1/job/status/89012';
    const mockResponse = { data: { status_url: mockStatusUrl } };
    axios.post.mockResolvedValue(mockResponse);

    const text = 'This is a test sentence with error.';
    const statusUrl = await sharpApiService.proofread(text);

    expect(axios.post).toHaveBeenCalledWith(
      `${sharpApiService.apiBaseUrl}${SharpApiJobTypeEnum.CONTENT_PROOFREAD.url}`,
      { content: text },
      { headers: sharpApiService.getHeaders() }
    );
    expect(statusUrl).toBe(mockStatusUrl);
  });
});

