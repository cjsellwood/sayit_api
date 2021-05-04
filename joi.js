const Joi = require("joi");

module.exports.registerSchema = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().min(8).max(100).required(),
  confirmPassword: Joi.ref("password"),
}).required()

module.exports.loginSchema = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().min(8).max(100).required(),
}).required()