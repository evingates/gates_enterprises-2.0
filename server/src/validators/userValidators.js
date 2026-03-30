const Joi = require('joi');

const updateProfileSchema = Joi.object({
  full_name: Joi.string().max(255),
  phone_number: Joi.string().allow('', null).max(50),
  location_city: Joi.string().allow('', null).max(100),
  about_me: Joi.string().allow('', null),
  experience_summary: Joi.string().allow('', null),
  qualifications: Joi.object().allow(null),
  skills: Joi.array().items(Joi.string()).allow(null),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required(),
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
};
