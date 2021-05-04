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

module.exports.newPost = Joi.object({
  topic_id: Joi.string().required(),
  title: Joi.string().required(),
  text: Joi.string(),
}).required()