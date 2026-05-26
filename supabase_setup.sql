-- CampusCares V2 — Supabase PostgreSQL canonical schema
-- Run in Supabase SQL Editor for a fresh project, or use migrations/001_schema_alignment.sql
-- to align an existing database created by Hibernate.

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            VARCHAR(32)  NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- donations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
    id                  BIGSERIAL PRIMARY KEY,
    donor_name          VARCHAR(255) NOT NULL,
    donor_email         VARCHAR(255) NOT NULL,
    item_name           VARCHAR(255) NOT NULL,
    category            VARCHAR(64)  NOT NULL,
    item_condition      VARCHAR(64)  NOT NULL,
    quantity            INTEGER      NOT NULL CHECK (quantity > 0),
    size                VARCHAR(128),
    subject_or_course   VARCHAR(255),
    description         TEXT,
    status              VARCHAR(32)  NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON donations (donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations (status);

-- ---------------------------------------------------------------------------
-- inventory_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_items (
    id                  BIGSERIAL PRIMARY KEY,
    item_name           VARCHAR(255) NOT NULL,
    category            VARCHAR(64)  NOT NULL,
    item_condition      VARCHAR(64)  NOT NULL,
    quantity_available  INTEGER      NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
    size                VARCHAR(128),
    subject_or_course   VARCHAR(255),
    qr_code             VARCHAR(128),
    source_donation_id  BIGINT REFERENCES donations (id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_item_name ON inventory_items (item_name);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory_items (category);
CREATE INDEX IF NOT EXISTS idx_inventory_source_donation ON inventory_items (source_donation_id);

-- ---------------------------------------------------------------------------
-- student_requests
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_requests (
    id                  BIGSERIAL PRIMARY KEY,
    student_name        VARCHAR(255) NOT NULL,
    student_email       VARCHAR(255) NOT NULL,
    requested_item_name VARCHAR(255) NOT NULL,
    category            VARCHAR(64)  NOT NULL,
    reason              TEXT         NOT NULL,
    status              VARCHAR(32)  NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_requests_email ON student_requests (student_email);
CREATE INDEX IF NOT EXISTS idx_student_requests_status ON student_requests (status);

-- ---------------------------------------------------------------------------
-- distributions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS distributions (
    id                  BIGSERIAL PRIMARY KEY,
    request_id          BIGINT REFERENCES student_requests (id) ON DELETE SET NULL,
    recipient_name      VARCHAR(255) NOT NULL,
    recipient_email     VARCHAR(255) NOT NULL,
    item_name           VARCHAR(255) NOT NULL,
    quantity_released   INTEGER      NOT NULL CHECK (quantity_released > 0),
    remarks             TEXT,
    distributed_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_distributions_request_id ON distributions (request_id);
CREATE INDEX IF NOT EXISTS idx_distributions_distributed_at ON distributions (distributed_at DESC);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id              BIGSERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    title           VARCHAR(255) NOT NULL DEFAULT 'Notification',
    message         TEXT         NOT NULL,
    notification_type VARCHAR(64) NOT NULL DEFAULT 'GENERAL',
    is_read         BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_email ON notifications (recipient_email);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (recipient_email, is_read);

-- ---------------------------------------------------------------------------
-- transaction_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transaction_logs (
    id              BIGSERIAL PRIMARY KEY,
    action          VARCHAR(128) NOT NULL,
    performed_by    VARCHAR(255),
    details         TEXT         NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transaction_logs_created_at ON transaction_logs (created_at DESC);
