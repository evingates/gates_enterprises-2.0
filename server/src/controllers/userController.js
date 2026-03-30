const db = require('../config/db');
const userQueries = require('../queries/userQueries');

const getProfile = async (req, res) => {
  const result = await db.query(userQueries.SELECT_USER_BY_ID, [req.user.user_id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, user: result.rows[0] });
};

const updateProfile = async (req, res) => {
  const { full_name, phone_number, location_city, about_me, experience_summary, qualifications, skills } = req.body;
  
  const result = await db.query(userQueries.UPDATE_USER, [
    full_name, phone_number, location_city, about_me, experience_summary, qualifications, skills,
    req.user.user_id
  ]);
  
  res.status(200).json({ success: true, user: result.rows[0] });
};

const updatePassword = async (req, res) => {
    // Left as an exercise or implement if needed
    res.status(501).json({ success: false, message: 'Not implemented' });
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword
};
