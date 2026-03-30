const db = require('../config/db');
const jobQueries = require('../queries/jobQueries');

const getAllJobs = async (req, res) => {
  const { location, experience_level, skills } = req.query;
  
  let query = 'SELECT j.*, c.company_name, c.website_url FROM job_openings j JOIN companies c ON j.company_id = c.company_id WHERE j.is_active = TRUE AND (j.deadline_date IS NULL OR j.deadline_date > CURRENT_DATE)';
  const params = [];
  
  if (location) {
    params.push(`%${location}%`);
    query += ` AND j.location ILIKE $${params.length}`;
  }
  if (experience_level) {
    params.push(experience_level);
    query += ` AND j.experience_level_needed = $${params.length}`;
  }
  if (skills) {
      // Very basic array containment
      const skillsArray = skills.split(',').map(s => s.trim());
      params.push(skillsArray);
      query += ` AND j.skills_required && $${params.length}`;
  }
  
  query += ' ORDER BY j.created_at DESC';
  
  const result = await db.query(query, params);
  res.status(200).json({ success: true, jobs: result.rows });
};

const getJobById = async (req, res) => {
  const result = await db.query(jobQueries.SELECT_JOB_BY_ID, [req.params.job_id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  res.status(200).json({ success: true, job: result.rows[0] });
};

const getMatchedJobs = async (req, res) => {
  const result = await db.query(jobQueries.SELECT_MATCHED_JOBS, [req.user.user_id]);
  res.status(200).json({ success: true, jobs: result.rows });
};

const getMyJobs = async (req, res) => {
  const result = await db.query(jobQueries.SELECT_JOBS_BY_COMPANY, [req.user.company_id]);
  res.status(200).json({ success: true, jobs: result.rows });
};

const createJob = async (req, res) => {
  const { job_title, description, salary_min, salary_max, location, experience_level_needed, skills_required, qualifications_needed, application_method, deadline_date } = req.body;
  const result = await db.query(jobQueries.INSERT_JOB, [
    req.user.company_id, job_title, description, salary_min, salary_max, location, experience_level_needed, skills_required, qualifications_needed, application_method, deadline_date
  ]);
  res.status(201).json({ success: true, job: result.rows[0] });
};

const updateJob = async (req, res) => {
  const { job_id } = req.params;
  const { job_title, description, salary_min, salary_max, location, experience_level_needed, skills_required, qualifications_needed, application_method, deadline_date } = req.body;
  
  const result = await db.query(jobQueries.UPDATE_JOB, [
    job_title, description, salary_min, salary_max, location, experience_level_needed, skills_required, qualifications_needed, application_method, deadline_date,
    job_id, req.user.company_id
  ]);
  
  if (result.rows.length === 0) {
    return res.status(403).json({ success: false, message: 'Forbidden or job not found' });
  }
  res.status(200).json({ success: true, job: result.rows[0] });
};

const toggleJobActive = async (req, res) => {
  const result = await db.query(jobQueries.TOGGLE_JOB_ACTIVE, [req.params.job_id, req.user.company_id]);
  if (result.rows.length === 0) {
    return res.status(403).json({ success: false, message: 'Forbidden or job not found' });
  }
  res.status(200).json({ success: true, job: result.rows[0] });
};

module.exports = {
  getAllJobs, getJobById, getMatchedJobs, getMyJobs, createJob, updateJob, toggleJobActive
};
