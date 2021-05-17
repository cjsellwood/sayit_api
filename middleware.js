const {
  registerSchema,
  loginSchema,
  newPostSchema,
  deletePostSchema,
  editPostSchema,
  votePostSchema,
  newTopicSchema,
  newCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
  singleTopicSchema,
} = require("./joi");
const ExpressError = require("./utils/ExpressError");

const validate = (req, res, next, schema) => {
  const isValid = schema.validate(req.body);
  if (isValid.error) {
    let message = isValid.error.details.map((error) => error.message).join(",");
    if (message === '"confirmPassword" must be [ref:password]') {
      message = "Passwords do not match";
    }
    return next(new ExpressError(400, message));
  }
  next();
};

module.exports.validateRegister = (req, res, next) => {
  validate(req, res, next, registerSchema);
};

module.exports.validateLogin = (req, res, next) => {
  validate(req, res, next, loginSchema);
};

module.exports.validateNewPost = (req, res, next) => {
  validate(req, res, next, newPostSchema);
};

module.exports.validateDeletePost = (req, res, next) => {
  validate(req, res, next, deletePostSchema);
};

module.exports.validateEditPost = (req, res, next) => {
  validate(req, res, next, editPostSchema);
};

module.exports.validateVotePost = (req, res, next) => {
  validate(req, res, next, votePostSchema);
};

module.exports.validateNewTopic = (req, res, next) => {
  validate(req, res, next, newTopicSchema);
};

module.exports.validateNewComment = (req, res, next) => {
  validate(req, res, next, newCommentSchema);
};

module.exports.validateDeleteComment = (req, res, next) => {
  validate(req, res, next, deleteCommentSchema);
};

module.exports.validateEditComment = (req, res, next) => {
  validate(req, res, next, editCommentSchema);
};

module.exports.validateSingleTopic = (req, res, next) => {
  validate(req, res, next, singleTopicSchema);
};
