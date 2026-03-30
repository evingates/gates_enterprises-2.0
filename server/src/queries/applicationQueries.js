const INSERT_APPLICATION = `
  INSERT INTO job_applications (user_id, job_id)
  VALUES ($1, $2)
  RETURNING *;
`;

const SELECT_APPLICATIONS_BY_USER = `
  SELECT a.application_id, a.job_id, a.application_status, a.created_at,
         j.job_title, j.location,
         c.company_name
  FROM job_applications a
  JOIN job_openings j ON a.job_id = j.job_id
  JOIN companies c ON j.company_id = c.company_id
  WHERE a.user_id = $1
  ORDER BY a.created_at DESC;
`;

const SELECT_APPLICATIONS_BY_JOB = `
  SELECT a.application_id, a.application_status, a.created_at,
         u.user_id, u.full_name, u.email, u.phone_number, u.location_city, u.skills, u.experience_summary
  FROM job_applications a
  JOIN users u ON a.user_id = u.user_id
  WHERE a.job_id = $1
  ORDER BY a.created_at ASC;
`;

const UPDATE_APPLICATION_STATUS = `
  UPDATE job_applications a
  SET application_status = $1
  FROM job_openings j
  WHERE a.application_id = $2 AND a.job_id = j.job_id AND j.company_id = $3
  RETURNING a.application_id, a.application_status;
`;

module.exports = {
  INSERT_APPLICATION,
  SELECT_APPLICATIONS_BY_USER,
  SELECT_APPLICATIONS_BY_JOB,
  UPDATE_APPLICATION_STATUS
};
