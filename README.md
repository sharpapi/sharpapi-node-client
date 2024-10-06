
![SharpAPI GitHub cover](https://sharpapi.com/sharpapi-github-php-bg.jpg "SharpAPI Laravel Client")

# SharpAPI NodeJS Client SDK

## 🚀 Automate workflows with AI-powered API

### Leverage AI API to streamline workflows in E-Commerce,Marketing, Content Management, HR Tech, Travel, and more.


**SharpAPI.com Node.js SDK Client** enables developers to integrate advanced artificial intelligence capabilities 
into their Node.js applications. This SDK simplifies interaction 
with the SharpAPI services, providing a seamless way to leverage 
AI for various use cases.

See more at [SharpAPI.com Website &raquo;](https://sharpapi.com/)


[![Version](https://img.shields.io/npm/v/@sharpapi/sharpapi-node-client.svg)](https://www.npmjs.com/package/@sharpapi/sharpapi-node-client)
[![License](https://img.shields.io/npm/l/@sharpapi/sharpapi-node-client.svg)](https://github.com/sharpapi/sharpapi-node-client/blob/master/LICENCE.md)

## Requirements

- Node.js >= 16.x

## Installation

```bash
npm i @sharpapi/sharpapi-node-client
```


---

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Usage](#usage)
  - [Initialization](#initialization)
  - [Available Methods](#available-methods)
4. [Examples](#examples)
5. [Testing](#testing)
6. [Contributing](#contributing)
7. [License](#license)

---

## Installation

### Prerequisites

- **Node.js** v14 or higher
- **npm** (Node Package Manager)

### Install via npm

You can install the SharpAPI Node.js SDK Client using npm:

```bash
npm install @sharpapi/sharpapi-node-client
```

### Install via Yarn

Alternatively, if you prefer using Yarn:

```bash
yarn add @sharpapi/sharpapi-node-client
```

---

## Configuration

### Setting Up Environment Variables

To protect your credentials, it's recommended to use a `.env` file to store your SharpAPI API key. Follow these steps:

1. **Create a `.env` File**

   In the root directory of your project, create a file named `.env`:

   ```plaintext
   SHARP_API_KEY=your_actual_api_key_here
   ```

2. **Install `dotenv` Package**

   To load environment variables from the `.env` file, install the `dotenv` package:

   ```bash
   npm install dotenv
   ```

3. **Load Environment Variables**

   At the beginning of your application (e.g., in `app.js` or `index.js`), add the following line to load the environment variables:

   ```javascript
   require('dotenv').config();
   ```

4. **Ensure `.env` is Ignored**

   Add `.env` to your `.gitignore` file to prevent sensitive information from being committed to version control:

   ```plaintext
   # .gitignore
   .env
   ```

---

## Usage

#### Check more [Usage Examples for SharpAPI NodeJS SDK Client](https://github.com/sharpapi/sharpapi-node-examples)

### Initialization

First, import and initialize the `SharpApiService` with your API key:

```javascript
// Load environment variables
require('dotenv').config();

// Import the SharpApiService
const { SharpApiService } = require('@sharpapi/sharpapi-node-client');

// Initialize the SharpApiService
const apiKey = process.env.SHARP_API_KEY;
const sharpApi = new SharpApiService(apiKey);
```

### Available Methods

The `SharpApiService` class provides various methods to interact with SharpAPI endpoints. Below is a list of available methods along with their descriptions:

1. **ping()**
  - **Description:** Checks the availability of the API and retrieves the current timestamp.
  - **Usage:**
    ```javascript
    const pingResponse = await sharpApi.ping();
    console.log(pingResponse);
    ```

2. **quota()**
  - **Description:** Retrieves details about your subscription's current quota and usage.
  - **Usage:**
    ```javascript
    const quotaInfo = await sharpApi.quota();
    console.log(quotaInfo);
    ```

3. **parseResume(filePath, language)**
  - **Description:** Parses a resume file (PDF/DOC/DOCX/TXT/RTF) and extracts data points.
  - **Parameters:**
    - `filePath` (string): Path to the resume file.
    - `language` (string, optional): Language of the resume (default: 'English').
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.parseResume('path/to/resume.pdf', 'English');
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

4. **generateJobDescription(jobDescriptionParameters)**
  - **Description:** Generates a job description based on provided parameters.
  - **Parameters:**
    - `jobDescriptionParameters` (JobDescriptionParameters): Object containing job details.
  - **Usage:**
    ```javascript
    const { JobDescriptionParameters } = require('@sharpapi/sharpapi-node-client');
    
    const jobDescriptionParams = new JobDescriptionParameters(
      "Software Engineer",
      "Tech Corp",
      ["Develop applications", "Collaborate with teams"],
      ["Proficiency in JavaScript", "Experience with APIs"],
      "English",
      "Professional",
      null
    );

    const statusUrl = await sharpApi.generateJobDescription(jobDescriptionParams);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

5. **relatedSkills(skillName, language, maxQuantity)**
  - **Description:** Retrieves a list of skills related to the provided skill name.
  - **Parameters:**
    - `skillName` (string): The skill to find related skills for.
    - `language` (string, optional): Language of the response (default: 'English').
    - `maxQuantity` (number, optional): Maximum number of related skills to retrieve.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.relatedSkills("JavaScript", "English", 5);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

6. **relatedJobPositions(jobPositionName, language, maxQuantity)**
  - **Description:** Retrieves a list of job positions related to the provided job position name.
  - **Parameters:**
    - `jobPositionName` (string): The job position to find related positions for.
    - `language` (string, optional): Language of the response (default: 'English').
    - `maxQuantity` (number, optional): Maximum number of related job positions to retrieve.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.relatedJobPositions("Frontend Developer", "English", 5);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

7. **productReviewSentiment(review)**
  - **Description:** Analyzes the sentiment of a product review.
  - **Parameters:**
    - `review` (string): The product review text.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.productReviewSentiment("This product is amazing!");
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

8. **productCategories(productName, language, maxQuantity, voiceTone, context)**
  - **Description:** Generates suitable categories for a given product.
  - **Parameters:**
    - `productName` (string): Name of the product.
    - `language` (string, optional): Language of the response (default: 'English').
    - `maxQuantity` (number, optional): Maximum number of categories to generate.
    - `voiceTone` (string, optional): Tone of the voice in the response (e.g., 'Neutral').
    - `context` (string, optional): Additional context for category generation.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.productCategories("Smartphone", "English", 5, "Neutral", null);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

9. **generateProductIntro(productData, language, maxLength, voiceTone)**
  - **Description:** Generates a marketing introduction for a product.
  - **Parameters:**
    - `productData` (string): Detailed description of the product.
    - `language` (string, optional): Language of the response (default: 'English').
    - `maxLength` (number, optional): Maximum length of the introduction.
    - `voiceTone` (string, optional): Tone of the voice in the response (e.g., 'Friendly').
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.generateProductIntro("This smartphone features...", "English", 100, "Friendly");
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

10. **generateThankYouEmail(productName, language, maxLength, voiceTone, context)**
  - **Description:** Generates a personalized thank-you email for customers.
  - **Parameters:**
    - `productName` (string): Name of the purchased product.
    - `language` (string, optional): Language of the email (default: 'English').
    - `maxLength` (number, optional): Maximum length of the email.
    - `voiceTone` (string, optional): Tone of the voice in the email (e.g., 'Professional').
    - `context` (string, optional): Additional context for the email generation.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.generateThankYouEmail("Smartphone", "English", 200, "Professional", null);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

11. **detectPhones(text)**
  - **Description:** Detects phone numbers within the provided text.
  - **Parameters:**
    - `text` (string): The text to scan for phone numbers.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.detectPhones("Contact me at 123-555-7890.");
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

12. **detectEmails(text)**
  - **Description:** Detects email addresses within the provided text.
  - **Parameters:**
    - `text` (string): The text to scan for email addresses.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.detectEmails("Please email us at support@example.com.");
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

13. **detectSpam(text)**
  - **Description:** Analyzes the provided text to determine if it contains spam content.
  - **Parameters:**
    - `text` (string): The text to analyze for spam.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.detectSpam("Congratulations! You've won a free prize.");
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

14. **summarizeText(text, language, maxLength, voiceTone, context)**
  - **Description:** Generates a summarized version of the provided text.
  - **Parameters:**
    - `text` (string): The text to summarize.
    - `language` (string, optional): Language of the summary (default: 'English').
    - `maxLength` (number, optional): Maximum length of the summary.
    - `voiceTone` (string, optional): Tone of the voice in the summary (e.g., 'Neutral').
    - `context` (string, optional): Additional context for the summarization.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.summarizeText("Long article text...", "English", 50, "Neutral", null);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

15. **generateKeywords(text, language, maxQuantity, voiceTone, context)**
  - **Description:** Generates a list of keywords based on the provided content.
  - **Parameters:**
    - `text` (string): The content to extract keywords from.
    - `language` (string, optional): Language of the keywords (default: 'English').
    - `maxQuantity` (number, optional): Maximum number of keywords to generate.
    - `voiceTone` (string, optional): Tone of the voice in the keywords (e.g., 'Neutral').
    - `context` (string, optional): Additional context for keyword generation.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.generateKeywords("Content for keyword extraction...", "English", 5, "Neutral", null);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

16. **translate(text, language, voiceTone, context)**
  - **Description:** Translates the provided text into the specified language.
  - **Parameters:**
    - `text` (string): The text to translate.
    - `language` (string): The target language for translation (e.g., 'Spanish').
    - `voiceTone` (string, optional): Tone of the voice in the translation (e.g., 'Neutral').
    - `context` (string, optional): Additional context for translation.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.translate("Hello, world!", "Spanish", "Neutral", null);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

17. **paraphrase(text, language, maxLength, voiceTone, context)**
  - **Description:** Generates a paraphrased version of the provided text.
  - **Parameters:**
    - `text` (string): The text to paraphrase.
    - `language` (string, optional): Language of the paraphrase (default: 'English').
    - `maxLength` (number, optional): Maximum length of the paraphrased text.
    - `voiceTone` (string, optional): Tone of the voice in the paraphrase (e.g., 'Neutral').
    - `context` (string, optional): Additional context for paraphrasing.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.paraphrase("Original text to paraphrase.", "English", 100, "Neutral", null);
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

18. **proofread(text)**
  - **Description:** Proofreads the provided text, checking for grammar and spelling errors.
  - **Parameters:**
    - `text` (string): The text to proofread.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.proofread("This is a txt with erors.");
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

19. **generateSeoTags(text, language, voiceTone)**
  - **Description:** Generates META tags based on the provided content.
  - **Parameters:**
    - `text` (string): The content to generate SEO tags from.
    - `language` (string, optional): Language of the SEO tags (default: 'English').
    - `voiceTone` (string, optional): Tone of the voice in the SEO tags (e.g., 'Neutral').
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.generateSeoTags("Content for SEO tag generation.", "English", "Neutral");
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

20. **travelReviewSentiment(text)**
  - **Description:** Analyzes the sentiment of a travel or hospitality product review.
  - **Parameters:**
    - `text` (string): The travel review text.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.travelReviewSentiment("The trip was amazing!");
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

21. **toursAndActivitiesProductCategories(productName, city, country, language, maxQuantity, voiceTone, context)**
  - **Description:** Generates suitable categories for Tours & Activities products.
  - **Parameters:**
    - `productName` (string): Name of the product.
    - `city` (string, optional): City related to the product.
    - `country` (string, optional): Country related to the product.
    - `language` (string, optional): Language of the response (default: 'English').
    - `maxQuantity` (number, optional): Maximum number of categories to generate.
    - `voiceTone` (string, optional): Tone of the voice in the response (e.g., 'Neutral').
    - `context` (string, optional): Additional context for category generation.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.toursAndActivitiesProductCategories(
      "City Tour",
      "Paris",
      "France",
      "English",
      5,
      "Neutral",
      null
    );
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

22. **hospitalityProductCategories(productName, city, country, language, maxQuantity, voiceTone, context)**
  - **Description:** Generates suitable categories for Hospitality products.
  - **Parameters:**
    - `productName` (string): Name of the product.
    - `city` (string, optional): City related to the product.
    - `country` (string, optional): Country related to the product.
    - `language` (string, optional): Language of the response (default: 'English').
    - `maxQuantity` (number, optional): Maximum number of categories to generate.
    - `voiceTone` (string, optional): Tone of the voice in the response (e.g., 'Neutral').
    - `context` (string, optional): Additional context for category generation.
  - **Usage:**
    ```javascript
    const statusUrl = await sharpApi.hospitalityProductCategories(
      "Luxury Hotel",
      "New York",
      "USA",
      "English",
      5,
      "Neutral",
      null
    );
    const resultJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultJob.getResultJson());
    ```

---
## API Documentation
For detailed usage and API methods, please refer to the [SharpAPI.com Documentation](https://sharpapi.com/documentation).

---
## Changelog
Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.


---
## Contributing
Check [CONTRIBUTION.md](CONTRIBUTION.md) file for details.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Support

If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/sharpapi/sharpapi-node-client/issues) or contact support at [contact@sharpapi.com](mailto:contact@sharpapi.com).

---
## Social Media

🚀 For the latest news, tutorials, and case studies, don't forget to follow us on:
- [SharpAPI X (formerly Twitter)](https://x.com/SharpAPI)
- [SharpAPI YouTube](https://www.youtube.com/@SharpAPI)
- [SharpAPI Vimeo](https://vimeo.com/SharpAPI)
- [SharpAPI LinkedIn](https://www.linkedin.com/products/a2z-web-ltd-sharpapicom-automate-with-aipowered-api/)
- [SharpAPI Facebook](https://www.facebook.com/profile.php?id=61554115896974)

---

**Happy Coding with SharpAPI Node.js SDK Client!**