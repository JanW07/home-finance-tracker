-- ============================================
-- CATEGORIES (Kategorie dla user_id = 1)
-- ============================================
INSERT INTO categories (id, name, icon, user_id) VALUES
(1, 'Jedzenie & Spożywcze', 'shopping-cart', 1),
(2, 'Mieszkanie & Rachunki', 'home', 1),
(3, 'Transport & Paliwo', 'car', 1),
(4, 'Rozrywka & Czas wolny', 'film', 1),
(5, 'Subskrypcje & Usługi', 'repeat', 1),
(6, 'Zdrowie & Uroda', 'heart', 1),
(7, 'Wynagrodzenie', 'briefcase', 1),
(8, 'Prezenty & Inne', 'gift', 1);

-- ============================================
-- SUBSCRIPTIONS (Subskrypcje dla user_id = 1)
-- ============================================
INSERT INTO subscriptions (id, title, amount, currency, category_id, billing_period, next_billing_period, status, transaction_type, user_id) VALUES
(1, 'Netflix HD', 43.00, 'PLN', 5, 'MONTHLY', '2026-09-01', 'ACTIVE', 'EXPENSE', 1),
(2, 'Spotify Family', 37.99, 'PLN', 5, 'MONTHLY', '2026-08-25', 'ACTIVE', 'EXPENSE', 1),
(3, 'Siłownia Calypso', 139.00, 'PLN', 6, 'MONTHLY', '2026-09-10', 'ACTIVE', 'EXPENSE', 1),
(4, 'Internet Światłowód', 79.90, 'PLN', 2, 'MONTHLY', '2026-09-05', 'ACTIVE', 'EXPENSE', 1),
(5, 'Amazon Prime', 49.00, 'PLN', 5, 'YEARLY', '2027-01-15', 'ACTIVE', 'EXPENSE', 1),
(6, 'Adobe Creative Cloud', 120.00, 'PLN', 5, 'MONTHLY', '2026-08-30', 'PAUSED', 'EXPENSE', 1);

-- ============================================
-- TRANSACTIONS (Transakcje dla user_id = 1)
-- ============================================

-- Przychody (Wynagrodzenie i poboczne)
INSERT INTO transactions (id, title, amount, currency, transaction_date, transaction_type, category_id, user_id, subscription_id) VALUES
(1, 'Wynagrodzenie - Czerwiec', 8500.00, 'PLN', '2026-06-10', 'INCOME', 7, 1, NULL),
(2, 'Wynagrodzenie - Lipiec', 8500.00, 'PLN', '2026-07-10', 'INCOME', 7, 1, NULL),
(3, 'Wynagrodzenie - Sierpień', 8800.00, 'PLN', '2026-08-10', 'INCOME', 7, 1, NULL),
(4, 'Zwrot za rachunek', 150.00, 'PLN', '2026-07-18', 'INCOME', 8, 1, NULL),
(5, 'Prezent Urodzinowy', 300.00, 'PLN', '2026-08-02', 'INCOME', 8, 1, NULL);

-- Wydatki stałe / Subskrypcyjne z przeszłości
INSERT INTO transactions (id, title, amount, currency, transaction_date, transaction_type, category_id, user_id, subscription_id) VALUES
(6, 'Netflix HD', 43.00, 'PLN', '2026-06-01', 'EXPENSE', 5, 1, 1),
(7, 'Spotify Family', 37.99, 'PLN', '2026-06-25', 'EXPENSE', 5, 1, 2),
(8, 'Siłownia Calypso', 139.00, 'PLN', '2026-06-10', 'EXPENSE', 6, 1, 3),
(9, 'Internet Światłowód', 79.90, 'PLN', '2026-06-05', 'EXPENSE', 2, 1, 4),

(10, 'Netflix HD', 43.00, 'PLN', '2026-07-01', 'EXPENSE', 5, 1, 1),
(11, 'Spotify Family', 37.99, 'PLN', '2026-07-25', 'EXPENSE', 5, 1, 2),
(12, 'Siłownia Calypso', 139.00, 'PLN', '2026-07-10', 'EXPENSE', 6, 1, 3),
(13, 'Internet Światłowód', 79.90, 'PLN', '2026-07-05', 'EXPENSE', 2, 1, 4),

(14, 'Netflix HD', 43.00, 'PLN', '2026-08-01', 'EXPENSE', 5, 1, 1),
(15, 'Internet Światłowód', 79.90, 'PLN', '2026-08-05', 'EXPENSE', 2, 1, 4),
(16, 'Siłownia Calypso', 139.00, 'PLN', '2026-08-10', 'EXPENSE', 6, 1, 3);

-- Wydatki codzienne (Zakupy, Transport, Rozrywka, Rachunki)
INSERT INTO transactions (id, title, amount, currency, transaction_date, transaction_type, category_id, user_id, subscription_id) VALUES
-- Czerwiec 2026
(17, 'Czynsz i opłaty', 2400.00, 'PLN', '2026-06-02', 'EXPENSE', 2, 1, NULL),
(18, 'Zakupy Biedronka', 215.40, 'PLN', '2026-06-04', 'EXPENSE', 1, 1, NULL),
(19, 'Paliwo Orlen', 320.00, 'PLN', '2026-06-08', 'EXPENSE', 3, 1, NULL),
(20, 'Kino Helm', 78.00, 'PLN', '2026-06-12', 'EXPENSE', 4, 1, NULL),
(21, 'Zakupy Lidl', 189.90, 'PLN', '2026-06-15', 'EXPENSE', 1, 1, NULL),
(22, 'Restauracja Italia', 165.00, 'PLN', '2026-06-20', 'EXPENSE', 4, 1, NULL),
(23, 'Przegląd klimatyzacji', 250.00, 'PLN', '2026-06-22', 'EXPENSE', 3, 1, NULL),

-- Lipiec 2026
(24, 'Czynsz i opłaty', 2400.00, 'PLN', '2026-07-02', 'EXPENSE', 2, 1, NULL),
(25, 'Zakupy Auchan', 342.10, 'PLN', '2026-07-03', 'EXPENSE', 1, 1, NULL),
(26, 'Paliwo Shell', 290.00, 'PLN', '2026-07-07', 'EXPENSE', 3, 1, NULL),
(27, 'Apteka Słoneczna', 85.50, 'PLN', '2026-07-11', 'EXPENSE', 6, 1, NULL),
(28, 'Bilety na koncert', 450.00, 'PLN', '2026-07-15', 'EXPENSE', 4, 1, NULL),
(29, 'Zakupy Biedronka', 198.30, 'PLN', '2026-07-19', 'EXPENSE', 1, 1, NULL),
(30, 'Wyjście ze znajomymi', 120.00, 'PLN', '2026-07-24', 'EXPENSE', 4, 1, NULL),
(31, 'Paliwo BP', 310.00, 'PLN', '2026-07-28', 'EXPENSE', 3, 1, NULL),

-- Sierpień 2026
(32, 'Czynsz i opłaty', 2400.00, 'PLN', '2026-08-02', 'EXPENSE', 2, 1, NULL),
(33, 'Zakupy Biedronka', 176.80, 'PLN', '2026-08-03', 'EXPENSE', 1, 1, NULL),
(34, 'Paliwo Orlen', 335.00, 'PLN', '2026-08-06', 'EXPENSE', 3, 1, NULL),
(35, 'Obiad na mieście', 89.00, 'PLN', '2026-08-09', 'EXPENSE', 4, 1, NULL),
(36, 'Zakupy Lidl', 245.60, 'PLN', '2026-08-12', 'EXPENSE', 1, 1, NULL),
(37, 'Fryzjer', 90.00, 'PLN', '2026-08-14', 'EXPENSE', 6, 1, NULL),
(38, 'Zakupy Rossmann', 112.40, 'PLN', '2026-08-16', 'EXPENSE', 6, 1, NULL);

-- ============================================
-- SEQUENCE RESETS
-- ============================================
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('subscriptions_id_seq', (SELECT MAX(id) FROM subscriptions));
SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions));