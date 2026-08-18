--changeset dev:002-subscription

CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    billing_period VARCHAR(20),
    next_billing_period DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE transactions
    DROP COLUMN billing_period,
    DROP COLUMN is_subscription,
    ADD COLUMN subscription_id BIGINT REFERENCES subscriptions(id) ON DELETE SET NULL;