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

module.exports.deletePostSchema = Joi.object({
  post_id: Joi.number().required(),
}).required();

module.exports.editPostSchema = Joi.object({
  text: Joi.string().required(),
  post_id: Joi.number().required(),
}).required();

module.exports.votePostSchema = Joi.object({
  vote: Joi.number().integer().min(-1).max(1).required(),
  post_id: Joi.number().required(),
}).required();

module.exports.newTopicSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
}).required();

module.exports.newCommentSchema = Joi.object({
  text: Joi.string().required(),
  post_id: Joi.number().required(),
  parent: Joi.number(),
}).required();

module.exports.deleteCommentSchema = Joi.object({
  comment_id: Joi.number().required(),
}).required();

module.exports.editCommentSchema = Joi.object({
  text: Joi.string().required(),
  comment_id: Joi.number().required(),
}).required();

module.exports.singleCommentSchema = Joi.object({
  text: Joi.string().required(),
  comment_id: Joi.number().required(),
}).required();

module.exports.singleTopicSchema = Joi.object({
  topic: Joi.string().required(),
}).required();
