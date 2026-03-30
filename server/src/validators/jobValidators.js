const Joi = require('joi');

const createJobSchema = Joi.object({
  job_title: Joi.string().required().max(255),
  description: Joi.string().required(),
  salary_min: Joi.number().integer().min(0).allow(null),
  salary_max: Joi.number().integer().min(Joi.ref('salary_min')).allow(null),
  location: Joi.string().allow('', null).max(200),
  experience_level_needed: Joi.string().valid('Entry', 'Mid', 'Senior').allow(null),
  skills_required: Joi.array().items(Joi.string()).allow(null),
  qualifications_needed: Joi.object().allow(null),
  application_method: Joi.string().allow('', null).max(100),
  deadline_date: Joi.date().greater('now').allow(null),
});

const updateJobSchema = Joi.object({
  job_title: Joi.string().max(255),
  description: Joi.string(),
  salary_min: Joi.number().integer().min(0).allow(null),
  salary_max: Joi.number().integer().min(Joi.ref('salary_min')).allow(null),
  location: Joi.string().allow('', null).max(200),
  experience_level_needed: Joi.string().valid('Entry', 'Mid', 'Senior').allow(null),
  skills_required: Joi.array().items(Joi.string()).allow(null),
  qualifications_needed: Joi.object().allow(null),
  application_method: Joi.string().allow('', null).max(100),
  deadline_date: Joi.date().greater('now').allow(null),
});

module.exports = {
  createJobSchema,
  updateJobSchema,
};
