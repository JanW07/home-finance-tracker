--changeset dev:001-initial-schema

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PLN',
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    is_subscription BOOLEAN NOT NULL DEFAULT FALSE,
    billing_period VARCHAR(20),
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);