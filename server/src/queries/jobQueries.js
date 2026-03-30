const INSERT_JOB = `
  INSERT INTO job_openings (company_id, job_title, description, salary_min, salary_max, location, experience_level_needed, skills_required, qualifications_needed, application_method, deadline_date)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING *;
`;

const SELECT_ALL_ACTIVE_JOBS = `
  SELECT j.*, c.company_name, c.website_url
  FROM job_openings j
  JOIN companies c ON j.company_id = c.company_id
  WHERE j.is_active = TRUE
    AND (j.deadline_date IS NULL OR j.deadline_date > CURRENT_DATE)
  ORDER BY j.created_at DESC;
`;

// Dynamic filtering will be handled in the controller based on optional params

const SELECT_JOB_BY_ID = `
  SELECT j.*, c.company_name, c.description AS company_desc, c.website_url, c.industry_type, c.headquarters_location
  FROM job_openings j
  JOIN companies c ON j.company_id = c.company_id
  WHERE j.job_id = $1;
`;

const UPDATE_JOB = `
  UPDATE job_openings
  SET job_title = COALESCE($1, job_title),
      description = COALESCE($2, description),
      salary_min = COALESCE($3, salary_min),
      salary_max = COALESCE($4, salary_max),
      location = COALESCE($5, location),
      experience_level_needed = COALESCE($6, experience_level_needed),
      skills_required = COALESCE($7, skills_required),
      qualifications_needed = COALESCE($8, qualifications_needed),
      application_method = COALESCE($9, application_method),
      deadline_date = COALESCE($10, deadline_date)
  WHERE job_id = $11 AND company_id = $12
  RETURNING *;
`;

const TOGGLE_JOB_ACTIVE = `
  UPDATE job_openings
  SET is_active = NOT is_active
  WHERE job_id = $1 AND company_id = $2
  RETURNING job_id, is_active;
`;

const SELECT_JOBS_BY_COMPANY = `
  SELECT * FROM job_openings
  WHERE company_id = $1
  ORDER BY created_at DESC;
`;

const SELECT_MATCHED_JOBS = `
  SELECT j.*, c.company_name, m.skill_match_count
  FROM v_skill_matched_jobs m
  JOIN job_openings j ON m.job_id = j.job_id
  JOIN companies c ON j.company_id = c.company_id
  WHERE m.user_id = $1
  ORDER BY m.skill_match_count DESC, j.created_at DESC;
`;

module.exports = {
  INSERT_JOB,
  SELECT_ALL_ACTIVE_JOBS,
  SELECT_JOB_BY_ID,
  UPDATE_JOB,
  TOGGLE_JOB_ACTIVE,
  SELECT_JOBS_BY_COMPANY,
  SELECT_MATCHED_JOBS
};
