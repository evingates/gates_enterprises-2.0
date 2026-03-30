const Joi = require('joi');

const applySchema = Joi.object({
  job_id: Joi.string().uuid().required(),
});

const updateStatusSchema = Joi.object({
  application_status: Joi.string().valid('Applied', 'Under Review', 'Interviewing', 'Offered', 'Rejected').required(),
});

module.exports = {
  applySchema,
  updateStatusSchema,
};
