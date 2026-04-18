-- Seed dataset for testing auth/roles
-- Run after schema.sql: mysql -u root -p DB_NAME < init/seed.sql
-- Passwords: all 'password' (hashed with bcrypt)

USE your_db_name;  -- Replace with your DB_NAME from .env

-- Clear existing data
DELETE FROM requests;
DELETE FROM users;

-- Seed Users (3 roles)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Manager User', 'manager@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager'),
('Employee User', 'employee@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee');

-- Get user IDs (run SELECT id FROM users; to get these, adjust if auto-inc different)
-- Assume IDs 1,2,3

-- Seed Requests (each user has requests at different statuses)
INSERT INTO requests (id, title, description, status, userId, createdAt) VALUES
-- Admin's requests
('10000000-0000-0000-0000-000000000001', 'Urgent Server Upgrade', 'Upgrade production servers before weekend', 'approved', 1, NOW() - INTERVAL 3 DAY),
('10000000-0000-0000-0000-000000000002', 'Security Audit Report', 'Complete Q4 security audit documentation', 'completed', 1, NOW() - INTERVAL 1 DAY),

-- Manager's requests
('20000000-0000-0000-0000-000000000001', 'Team Budget Approval', 'Approve Q1 team budget allocation', 'in_review', 2, NOW() - INTERVAL 5 DAY),
('20000000-0000-0000-0000-000000000002', 'New Hire Onboarding', 'Setup new developer onboarding process', 'rejected', 2, NOW() - INTERVAL 4 DAY),

-- Employee's requests
('30000000-0000-0000-0000-000000000001', 'Bug Fix Priority', 'High priority login bug in staging', 'pending', 3, NOW()),
('30000000-0000-0000-0000-000000000002', 'Feature Request Form', 'New form validation improvements', 'in_review', 3, NOW() - INTERVAL 2 DAY);

SELECT 'Seed complete! Test logins: admin/manager/employee@test.com (pw: password)' as message;

