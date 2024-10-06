/**
 * JobDescriptionParameters DTO
 */
class JobDescriptionParameters {
  constructor(
    name,
    company_name = null,
    minimum_work_experience = null,
    minimum_education = null,
    employment_type = null,
    required_skills = null,
    optional_skills = null,
    country = null,
    remote = null,
    visa_sponsored = null,
    voice_tone = null,
    context = null,
    language = null,
  ) {
    this.name = name;
    this.company_name = company_name;
    this.minimum_work_experience = minimum_work_experience;
    this.minimum_education = minimum_education;
    this.employment_type = employment_type;
    this.required_skills = required_skills;
    this.optional_skills = optional_skills;
    this.country = country;
    this.remote = remote;
    this.visa_sponsored = visa_sponsored;
    this.voice_tone = voice_tone;
    this.context = context;
    this.language = language;
  }

  toJSON() {
    return {
      name: this.name,
      company_name: this.company_name,
      minimum_work_experience: this.minimum_work_experience,
      minimum_education: this.minimum_education,
      employment_type: this.employment_type,
      required_skills: this.required_skills,
      optional_skills: this.optional_skills,
      country: this.country,
      remote: this.remote,
      visa_sponsored: this.visa_sponsored,
      voice_tone: this.voice_tone,
      context: this.context,
      language: this.language,
    };
  }
}

module.exports = { JobDescriptionParameters };

