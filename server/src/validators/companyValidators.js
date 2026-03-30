const Joi = require('joi');

const updateCompanySchema = Joi.object({
  company_name: Joi.string().max(255),
  description: Joi.string().allow('', null),
  industry_type: Joi.string().allow('', null).max(100),
  headquarters_location: Joi.string().allow('', null).max(200),
  phone_number: Joi.string().allow('', null).max(50),
  website_url: Joi.string().uri().allow('', null).max(255),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required(),
});

module.exports = {
  updateCompanySchema,
  changePasswordSchema,
};
