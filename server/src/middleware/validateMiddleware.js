const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(422).json({ success: false, errors: messages });
    }
    next();
  };
};

module.exports = validateMiddleware;
