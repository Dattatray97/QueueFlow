-- Default Services (Clinics)
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (1, 'Doctor Consultation', 'General checkup and consultation', 15, 1, 'CLINIC');
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (2, 'Blood Test', 'Standard blood sample collection', 10, 1, 'CLINIC');

-- Default Services (Banks)
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (3, 'Cash Deposit/Withdrawal', 'Teller services for cash', 5, 1, 'BANK');
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (4, 'Loan Inquiry', 'Speak with a loan officer', 30, 1, 'BANK');

-- Default Services (Colleges)
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (5, 'Admission Help', 'Assistance with enrollment', 20, 1, 'COLLEGE');
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (6, 'Document Verification', 'Verify academic documents', 10, 1, 'COLLEGE');

-- Default Services (Government)
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (7, 'License Renewal', 'Renew driving or trade license', 15, 1, 'GOVERNMENT');
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (8, 'Tax Inquiry', 'Speak with a tax representative', 20, 1, 'GOVERNMENT');

-- Default Services (Service Centers)
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (9, 'Device Repair Drop-off', 'Drop off a broken device', 10, 1, 'SERVICE_CENTER');
INSERT IGNORE INTO services (id, service_name, description, duration, is_active, industry) VALUES (10, 'Technical Support', 'In-person tech troubleshooting', 30, 1, 'SERVICE_CENTER');

-- Default Admin User (password: admin123 - BCrypt encoded)
INSERT IGNORE INTO users (id, name, email, phone, password, role, industry, created_at)
VALUES (1, 'Admin', 'admin@queueflow.com', '9999999999',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'ADMIN', 'General', NOW());
