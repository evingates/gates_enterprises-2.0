const Joi = require('joi');

const applySchema = Joi.object({
  job_id: Joi.number().integer().positive().required(),
});

const updateStatusSchema = Joi.object({
  application_status: Joi.string().valid('pending', 'Applied', 'Under Review', 'Interviewing', 'Offered', 'Approved', 'Rejected').required(),
});

module.exports = {
  applySchema,
  updateStatusSchema,
};
