-- ==========================================================
-- Database: event_management
-- Schema Creation Script for Event Management System
-- ==========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  email VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  college VARCHAR(255) DEFAULT 'Aurora Deemed to be University',
  department VARCHAR(255),
  roll_no VARCHAR(100),
  year VARCHAR(50),
  joined_clubs TEXT[] DEFAULT '{}',
  profile_picture TEXT DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  achievements TEXT[] DEFAULT '{}',
  activity_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  date VARCHAR(50),
  time VARCHAR(50),
  venue VARCHAR(255),
  coordinator VARCHAR(255),
  student_coordinator VARCHAR(255),
  price VARCHAR(50),
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  trending BOOLEAN DEFAULT false,
  total_seats INTEGER DEFAULT 100,
  rules TEXT[] DEFAULT '{}',
  prize_pool VARCHAR(100),
  requirements TEXT
);

-- 3. Registrations Mapping Table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  event_id VARCHAR(100) REFERENCES events(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, event_id)
);

-- 4. Feedbacks Table
CREATE TABLE IF NOT EXISTS feedbacks (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  event_id VARCHAR(100) REFERENCES events(id) ON DELETE CASCADE,
  event_title VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
