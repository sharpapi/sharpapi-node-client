
![SharpAPI GitHub cover](https://sharpapi.com/sharpapi-github-php-bg.jpg "SharpAPI Laravel Client")

# SharpAPI NodeJS Client SDK

## 🚀 Automate workflows with AI-powered API

### Leverage AI API to streamline workflows in E-Commerce, Marketing, Content Management, HR Tech, Travel, and more.

See more at [SharpAPI.com Website &raquo;](https://sharpapi.com/)


[![Version](https://img.shields.io/npm/v/sharpapi-node-client.svg)](https://www.npmjs.com/package/sharpapi-node-client)
[![License](https://img.shields.io/npm/l/sharpapi-node-client.svg)](https://github.com/yourusername/sharpapi-node-client/blob/main/LICENSE.md)

## Requirements

- Node.js >= 16.x

## Installation

```bash
npm install sharpapi-node-client
```

## What can it do for you?

- **E-commerce**
  - Generate engaging product introductions.
  - Create personalized thank-you emails.
  - Streamline product categorization.
  - Perform sentiment analysis on product reviews.

- **Content & Marketing Automation**
  - Translate text for a global audience.
  - Paraphrase and proofread any text.
  - Detect spam content.
  - Extract contact information.
  - Summarize content and generate keywords/tags.
  - Generate SEO meta tags.

- **HR Tech**
  - Generate job descriptions.
  - Identify related job positions and skills.
  - Parse and extract information from resumes.

- **Travel, Tourism & Hospitality**
  - Analyze sentiment in travel reviews.
  - Categorize tours, activities, and hospitality products.

## Usage

### Simple Example

```javascript
const { SharpApiService } = require('sharpapi-node-client');

const sharpApi = new SharpApiService('YOUR_SHARP_API_KEY');

(async () => {
  try {
    const statusUrl = await sharpApi.productCategories(
      'Lenovo Chromebook Laptop (2023), 14" FHD Touchscreen Slim 3, 8-Core MediaTek Kompanio 520 CPU, 4GB RAM, 128GB Storage',
      'German', // optional language
      400, // optional quantity
      'Neutral', // optional voice tone
      'Optional current e-store categories' // optional context
    );

    const resultSharpApiJob = await sharpApi.fetchResults(statusUrl);
    console.log(resultSharpApiJob.getResultJson());
  } catch (error) {
    console.error(error);
  }
})();
```

## Documentation
For detailed usage and API methods, please refer to the [SharpAPI.com Documentation](https://sharpapi.com/documentation).

## Changelog
Please see CHANGELOG.md for more information on what has changed recently.

## License

The MIT License (MIT). Please see License File for more information.





