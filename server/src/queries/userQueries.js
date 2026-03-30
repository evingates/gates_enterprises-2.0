const INSERT_USER = `
  INSERT INTO users (email, password_hash, full_name, id_number, phone_number)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING user_id, email, full_name;
`;

const SELECT_USER_BY_EMAIL = `
  SELECT * FROM users WHERE email = $1;
`;

const SELECT_USER_BY_ID = `
  SELECT user_id, email, full_name, id_number, phone_number, location_city, about_me, experience_summary, qualifications, skills, created_at, updated_at
  FROM users 
  WHERE user_id = $1;
`;

const UPDATE_USER = `
  UPDATE users 
  SET full_name = COALESCE($1, full_name),
      phone_number = COALESCE($2, phone_number),
      location_city = COALESCE($3, location_city),
      about_me = COALESCE($4, about_me),
      experience_summary = COALESCE($5, experience_summary),
      qualifications = COALESCE($6, qualifications),
      skills = COALESCE($7, skills)
  WHERE user_id = $8
  RETURNING user_id, email, full_name, phone_number, location_city, about_me, experience_summary, qualifications, skills;
`;

const UPDATE_USER_PASSWORD = `
  UPDATE users SET password_hash = $1 WHERE user_id = $2;
`;

module.exports = {
  INSERT_USER,
  SELECT_USER_BY_EMAIL,
  SELECT_USER_BY_ID,
  UPDATE_USER,
  UPDATE_USER_PASSWORD
};
