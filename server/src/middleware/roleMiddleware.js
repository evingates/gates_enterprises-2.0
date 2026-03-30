const roleMiddleware = (allowedRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== allowedRole) {
      return res.status(403).json({ success: false, message: 'Forbidden. Incorrect role.' });
    }
    next();
  };
};

module.exports = roleMiddleware;
