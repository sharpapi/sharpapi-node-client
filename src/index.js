// sharpapi-node-client/src/index.js
const { SharpApiService } = require('./SharpApiService');
const { JobDescriptionParameters } = require('./Dto/JobDescriptionParameters');
const { SharpApiJob } = require('./Dto/SharpApiJob');

// Export Enums if needed
const { SharpApiJobStatusEnum } = require('./Enums/SharpApiJobStatusEnum');
const { SharpApiJobTypeEnum } = require('./Enums/SharpApiJobTypeEnum');
const { SharpApiVoiceTone } = require('./Enums/SharpApiVoiceTone');
const { SharpApiLanguages } = require('./Enums/SharpApiLanguages');

module.exports = {
  SharpApiService,
  JobDescriptionParameters,
  SharpApiJob,
  SharpApiJobStatusEnum,
  SharpApiJobTypeEnum,
  SharpApiVoiceTone,
  SharpApiLanguages,
  // Export other classes or enums as needed
};

