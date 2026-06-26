-- ========================
-- QueueFlow Database Schema
-- ========================

CREATE DATABASE IF NOT EXISTS queueflow_db;
USE queueflow_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    industry VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    duration INT NOT NULL DEFAULT 15,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    industry VARCHAR(50) NOT NULL DEFAULT 'General'
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    token_no VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'BOOKED',
    industry VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_token ON appointments(token_no);
CREATE INDEX idx_users_email ON users(email);

-- Default Services
INSERT INTO services (service_name, description, duration, is_active, industry) VALUES
('Consultation', 'General consultation service', 15, 1, 'CLINIC'),
('Document Verification', 'Verify and process documents', 10, 1, 'GOVERNMENT'),
('Admission Help', 'Help with admission process', 20, 1, 'COLLEGE'),
('General Inquiry', 'General information desk', 10, 1, 'General'),
('Payment & Billing', 'Handle payments and billing', 15, 1, 'BANK');

-- Default Admin (password: admin123)
INSERT INTO users (name, email, phone, password, role, industry) VALUES
('Admin', 'admin@queueflow.com', '9999999999',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ADMIN', 'General');
