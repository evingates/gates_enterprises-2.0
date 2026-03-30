const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Token missing.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, role, ... } or { company_id, role }
    
    // Normalize user_id and company_id to user_id for easier role-based access if needed,
    // actually, let's keep them explicit based on the payload.
    // If it's a seeker, decoded.user_id exists. If employer, decoded.company_id exists.
    if (decoded.role === 'employer' && decoded.company_id) {
       req.user.user_id = decoded.company_id; // Aliased for simpler checks, or keep track separately in roleMiddleware.
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
