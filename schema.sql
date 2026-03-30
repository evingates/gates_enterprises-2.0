-- Drop tables if they exist to allow clean recreation
DROP VIEW IF EXISTS v_skill_matched_jobs;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS job_openings CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop Enums if they exist
DROP TYPE IF EXISTS experience_level CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;

-- Create Enums
CREATE TYPE experience_level AS ENUM ('Entry', 'Mid', 'Senior');
CREATE TYPE verification_status AS ENUM ('Pending', 'Verified', 'Rejected');
CREATE TYPE application_status AS ENUM ('Applied', 'Under Review', 'Interviewing', 'Offered', 'Rejected');

-- Users (Seekers) Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    id_number VARCHAR(100),
    phone_number VARCHAR(50),
    location_city VARCHAR(100),
    about_me TEXT,
    experience_summary TEXT,
    qualifications JSONB,
    skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies (Employers) Table
CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    industry_type VARCHAR(100),
    headquarters_location VARCHAR(200),
    phone_number VARCHAR(50),
    website_url VARCHAR(255),
    verification_status verification_status DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Openings Table
CREATE TABLE job_openings (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    location VARCHAR(200),
    experience_level_needed experience_level,
    skills_required TEXT[],
    qualifications_needed JSONB,
    application_method VARCHAR(100), -- E.g., 'Internal', 'External URL'
    deadline_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE job_applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES job_openings(job_id) ON DELETE CASCADE,
    application_status application_status DEFAULT 'Applied',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id) -- A seeker can only apply once to a specific job
);

-- View for Skill Matching
-- Unnests seeker skills and job skills, counts intersections
CREATE OR REPLACE VIEW v_skill_matched_jobs AS
WITH user_skills AS (
    SELECT user_id, unnest(skills) AS skill
    FROM users
    WHERE skills IS NOT NULL
),
job_skills AS (
    SELECT job_id, unnest(skills_required) AS required_skill
    FROM job_openings
    WHERE is_active = TRUE AND skills_required IS NOT NULL
)
SELECT 
    us.user_id,
    js.job_id,
    COUNT(*) AS skill_match_count
FROM user_skills us
JOIN job_skills js ON LOWER(us.skill) = LOWER(js.required_skill)
GROUP BY us.user_id, js.job_id;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_companies_updated
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_job_openings_updated
BEFORE UPDATE ON job_openings
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_job_applications_updated
BEFORE UPDATE ON job_applications
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
