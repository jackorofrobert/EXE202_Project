-- Insert admin user
INSERT INTO users (email, name, password_hash, role) VALUES
('admin@emocare.com', 'Admin User', '$2a$10$example_hash', 'admin');

-- Insert sample psychologists
INSERT INTO users (email, name, password_hash, role) VALUES
('dr.nguyen@emocare.com', 'Dr. Nguyen Van A', '$2a$10$example_hash', 'psychologist'),
('dr.tran@emocare.com', 'Dr. Tran Thi B', '$2a$10$example_hash', 'psychologist');

-- Insert sample users
INSERT INTO users (email, name, password_hash, role, tier) VALUES
('user1@example.com', 'Nguyen Van C', '$2a$10$example_hash', 'user', 'free'),
('user2@example.com', 'Tran Thi D', '$2a$10$example_hash', 'user', 'gold'),
('user3@example.com', 'Le Van E', '$2a$10$example_hash', 'user', 'free'),
('user4@example.com', 'Pham Thi F', '$2a$10$example_hash', 'user', 'gold');
