const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // PostgreSQL Unique Constraint Violation
  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'Resource already exists or duplicate violation.' });
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500 
    ? 'Internal server error' 
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorMiddleware;
