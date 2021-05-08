const Joi = require("joi");

module.exports.registerSchema = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().min(8).max(100).required(),
  confirmPassword: Joi.ref("password"),
}).required();

module.exports.loginSchema = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().min(8).max(100).required(),
}).required();

module.exports.newPostSchema = Joi.object({
  topic: Joi.string().required(),
  title: Joi.string().required(),
  text: Joi.string(),
}).required();

module.exports.newTopicSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
}).required(); 

module.exports.newCommentSchema = Joi.object({
  text: Joi.string().required(),
  post_id: Joi.number().required(),
}).required()