const Joi = require('joi');

const registerSeekerSchema = Joi.object({
  full_name: Joi.string().required().max(255),
  email: Joi.string().email().required().max(255),
  password: Joi.string().min(8).required(),
  id_number: Joi.string().allow('', null).max(100),
  phone_number: Joi.string().allow('', null).max(50),
});

const registerEmployerSchema = Joi.object({
  company_name: Joi.string().required().max(255),
  email: Joi.string().email().required().max(255),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSeekerSchema,
  registerEmployerSchema,
  loginSchema,
};
