const db = require('../config/db');
const companyQueries = require('../queries/companyQueries');

const getCompany = async (req, res) => {
  const result = await db.query(companyQueries.SELECT_COMPANY_BY_ID, [req.user.company_id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }
  res.status(200).json({ success: true, company: result.rows[0] });
};

const updateCompany = async (req, res) => {
  const { company_name, description, industry_type, headquarters_location, phone_number, website_url } = req.body;
  
  const result = await db.query(companyQueries.UPDATE_COMPANY, [
    company_name, description, industry_type, headquarters_location, phone_number, website_url,
    req.user.company_id
  ]);
  
  res.status(200).json({ success: true, company: result.rows[0] });
};

const getPublicCompany = async (req, res) => {
  const result = await db.query(companyQueries.GET_PUBLIC_COMPANY, [req.params.company_id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }
  res.status(200).json({ success: true, company: result.rows[0] });
};

const updateVerificationStatus = async (req, res) => {
  res.status(501).json({ success: false, message: 'Admin endpoint not implemented yet' });
};

module.exports = {
  getCompany,
  updateCompany,
  getPublicCompany,
  updateVerificationStatus
};
