const INSERT_COMPANY = `
  INSERT INTO companies (email, password_hash, company_name)
  VALUES ($1, $2, $3)
  RETURNING company_id, email, company_name;
`;

const SELECT_COMPANY_BY_EMAIL = `
  SELECT * FROM companies WHERE email = $1;
`;

const SELECT_COMPANY_BY_ID = `
  SELECT company_id, email, company_name, description, industry_type, headquarters_location, phone_number, website_url, verification_status, created_at
  FROM companies
  WHERE company_id = $1;
`;

const UPDATE_COMPANY = `
  UPDATE companies 
  SET company_name = COALESCE($1, company_name),
      description = COALESCE($2, description),
      industry_type = COALESCE($3, industry_type),
      headquarters_location = COALESCE($4, headquarters_location),
      phone_number = COALESCE($5, phone_number),
      website_url = COALESCE($6, website_url)
  WHERE company_id = $7
  RETURNING company_id, email, company_name, description, industry_type, headquarters_location, phone_number, website_url, verification_status;
`;

const UPDATE_COMPANY_PASSWORD = `
  UPDATE companies SET password_hash = $1 WHERE company_id = $2;
`;

const GET_PUBLIC_COMPANY = `
  SELECT company_id, company_name, description, industry_type, headquarters_location, website_url
  FROM companies
  WHERE company_id = $1;
`;

const UPDATE_VERIFICATION_STATUS = `
  UPDATE companies SET verification_status = $1 WHERE company_id = $2 RETURNING company_id, verification_status;
`;

module.exports = {
  INSERT_COMPANY,
  SELECT_COMPANY_BY_EMAIL,
  SELECT_COMPANY_BY_ID,
  UPDATE_COMPANY,
  UPDATE_COMPANY_PASSWORD,
  GET_PUBLIC_COMPANY,
  UPDATE_VERIFICATION_STATUS
};
