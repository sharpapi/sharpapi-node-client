const { SharpApiJobStatusEnum } = require('../Enums/SharpApiJobStatusEnum');
const { SharpApiJobTypeEnum } = require('../Enums/SharpApiJobTypeEnum');

/**
 * SharpApiJob DTO
 */
class SharpApiJob {
  constructor(id, type, status, result) {
    this.id = id;
    this.type = type;
    this.status = status;
    this.result = result;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      result: this.result,
    };
  }

  /**
   * Returns SharpAPI job ID (UUID format)
   */
  getId() {
    return this.id;
  }

  /**
   * Returns one of the job types available in SharpApiJobTypeEnum
   */
  getType() {
    return this.type;
  }

  /**
   * Returns one of the job statuses available in SharpApiJobStatusEnum
   */
  getStatus() {
    return this.status;
  }

  /**
   * Returns job result as a prettified JSON string
   */
  getResultJson() {
    return this.result ? JSON.stringify(this.result, null, 2) : null;
  }

  /**
   * Returns job result contents as JavaScript object
   */
  getResultObject() {
    return this.result;
  }
}

module.exports = { SharpApiJob };

