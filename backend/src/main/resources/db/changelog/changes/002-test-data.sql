--changeset dev:002-test-data
-- ============================================
-- USERS
-- Note: password_hash below is bcrypt hash of "secret"
-- ============================================
INSERT INTO users (id, username, email, password_hash, created_at) VALUES
(1, 'john_smith', 'john.smith@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '2025-01-10 08:00:00');

-- ============================================
-- SEQUENCE RESET
-- ============================================
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));