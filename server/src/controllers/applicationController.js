const db = require('../config/db');
const applicationQueries = require('../queries/applicationQueries');

const applyToJob = async (req, res) => {
  const { job_id } = req.body;
  const jobIdInt = parseInt(job_id, 10);
  if (isNaN(jobIdInt)) {
    return res.status(400).json({ success: false, message: 'Invalid job ID.' });
  }
  try {
    const result = await db.query(applicationQueries.INSERT_APPLICATION, [req.user.user_id, jobIdInt]);
    res.status(201).json({ success: true, application: result.rows[0] });
  } catch (err) {
    // Unique constraint violation: user already applied
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'You have already applied for this job.' });
    }
    throw err; // let express-async-errors handle the rest
  }
};

const getSeekerApplications = async (req, res) => {
  const result = await db.query(applicationQueries.SELECT_APPLICATIONS_BY_USER, [req.user.user_id]);
  res.status(200).json({ success: true, applications: result.rows });
};

const getJobApplications = async (req, res) => {
  // First, verify the job belongs to this company
  const jobResult = await db.query('SELECT company_id FROM job_openings WHERE job_id = $1', [req.params.job_id]);
  if (jobResult.rows.length === 0 || jobResult.rows[0].company_id !== req.user.company_id) {
    return res.status(403).json({ success: false, message: 'Forbidden or job not found' });
  }
  
  const result = await db.query(applicationQueries.SELECT_APPLICATIONS_BY_JOB, [req.params.job_id]);
  res.status(200).json({ success: true, applications: result.rows });
};

const updateApplicationStatus = async (req, res) => {
  const { application_status } = req.body;
  const { application_id } = req.params;
  
  const result = await db.query(applicationQueries.UPDATE_APPLICATION_STATUS, [
    application_status, application_id, req.user.company_id
  ]);
  
  if (result.rows.length === 0) {
    return res.status(403).json({ success: false, message: 'Forbidden or application not found' });
  }
  res.status(200).json({ success: true, application: result.rows[0] });
};

module.exports = {
  applyToJob, getSeekerApplications, getJobApplications, updateApplicationStatus
};
