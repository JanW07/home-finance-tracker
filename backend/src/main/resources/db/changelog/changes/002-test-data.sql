--changeset dev:002-test-data
-- ============================================
-- USERS
-- Note: password_hash below is bcrypt hash of "secret" (well-known bcrypt example hash)
-- ============================================
INSERT INTO users (id, username, email, password_hash, created_at) VALUES
(1, 'john_smith', 'john.smith@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '2025-01-10 08:00:00'),
(2, 'anna_white', 'anna.white@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '2025-03-22 14:30:00');

-- ============================================
-- CATEGORIES
-- (3 global categories with no owner + 2 private categories assigned to a specific user)
-- ============================================
INSERT INTO categories (id, name, icon, user_id) VALUES
(1, 'Food', 'restaurant', NULL),
(2, 'Transport', 'car', NULL),
(3, 'Entertainment', 'film', NULL),
(4, 'John Hobby', 'gamepad', 1),
(5, 'Anna Private', 'lock', 2);

-- ============================================
-- SUBSCRIPTIONS
-- (spread across time - some overdue, some upcoming, one inactive)
-- ============================================
INSERT INTO subscriptions (id, name, amount, currency, billing_period, next_payment_date, active, category_id, user_id) VALUES
(1, 'Netflix', 43.00, 'PLN', 'MONTHLY', '2026-08-05', TRUE, 3, 1),
(2, 'Spotify', 19.99, 'PLN', 'MONTHLY', '2026-08-20', TRUE, 3, 1),
(3, 'FitClub Gym', 129.00, 'PLN', 'MONTHLY', '2026-09-01', TRUE, 4, 1),
(4, 'iCloud+', 4.99, 'PLN', 'MONTHLY', '2026-08-15', TRUE, 5, 2),
(5, 'Amazon Prime (cancelled)', 49.00, 'PLN', 'YEARLY', '2025-12-01', FALSE, 3, 2);

-- ============================================
-- EXPENSES
-- (spread across a couple of months, different categories)
-- ============================================
INSERT INTO expenses (id, title, amount, currency, purchase_date, category_id, user_id) VALUES
(1, 'Grocery shopping', 156.43, 'PLN', '2026-08-01 10:15:00', 1, 1),
(2, 'Gas station', 210.00, 'PLN', '2026-08-03 18:40:00', 2, 1),
(3, 'Movie tickets', 65.00, 'PLN', '2026-08-05 20:00:00', 3, 1),
(4, 'Restaurant dinner', 88.50, 'PLN', '2026-07-28 13:20:00', 1, 1),
(5, 'Grocery shopping', 203.10, 'PLN', '2026-08-10 09:05:00', 1, 2),
(6, 'Taxi ride', 34.20, 'PLN', '2026-08-11 22:15:00', 2, 2),
(7, 'Concert ticket', 150.00, 'PLN', '2026-08-12 19:00:00', 3, 2),
(8, 'New video game', 249.00, 'PLN', '2026-08-02 16:00:00', 4, 1);

-- ============================================
-- SEQUENCE RESET
-- Without this, the next INSERT done by Hibernate (e.g. via API)
-- would try to reuse id=1 -> constraint violation
-- ============================================
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('subscriptions_id_seq', (SELECT MAX(id) FROM subscriptions));
SELECT setval('expenses_id_seq', (SELECT MAX(id) FROM expenses));