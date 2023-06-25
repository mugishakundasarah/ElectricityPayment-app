const Joi = require('joi');

const tokenValidationSchema = Joi.object({
  meterNumber: Joi.string().required().length(6),
  amount: Joi.number().required().min(100).max(182500),
});

module.exports = tokenValidationSchema;
