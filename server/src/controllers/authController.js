const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const userQueries = require('../queries/userQueries');
const companyQueries = require('../queries/companyQueries');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const registerSeeker = async (req, res) => {
  const { email, password, full_name, id_number, phone_number } = req.body;
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  
  const result = await db.query(userQueries.INSERT_USER, [email, password_hash, full_name, id_number, phone_number]);
  const user = result.rows[0];
  
  const token = generateToken({ user_id: user.user_id, role: 'seeker' });
  res.status(201).json({ success: true, token, user: { ...user, role: 'seeker' } });
};

const loginSeeker = async (req, res) => {
  const { email, password } = req.body;
  
  const result = await db.query(userQueries.SELECT_USER_BY_EMAIL, [email]);
  const user = result.rows[0];
  
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const token = generateToken({ user_id: user.user_id, role: 'seeker' });
  delete user.password_hash;
  
  res.status(200).json({ success: true, token, user: { ...user, role: 'seeker' } });
};

const registerEmployer = async (req, res) => {
  const { email, password, company_name } = req.body;
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  
  const result = await db.query(companyQueries.INSERT_COMPANY, [email, password_hash, company_name]);
  const company = result.rows[0];
  
  const token = generateToken({ company_id: company.company_id, role: 'employer' });
  res.status(201).json({ success: true, token, user: { user_id: company.company_id, company_id: company.company_id, email: company.email, name: company.company_name, role: 'employer' } });
};

const loginEmployer = async (req, res) => {
  const { email, password } = req.body;
  
  const result = await db.query(companyQueries.SELECT_COMPANY_BY_EMAIL, [email]);
  const company = result.rows[0];
  
  if (!company || !(await bcrypt.compare(password, company.password_hash))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const token = generateToken({ company_id: company.company_id, role: 'employer' });
  delete company.password_hash;
  
  res.status(200).json({ success: true, token, user: { user_id: company.company_id, company_id: company.company_id, email: company.email, name: company.company_name, role: 'employer' } });
};

module.exports = {
  registerSeeker,
  loginSeeker,
  registerEmployer,
  loginEmployer
};
