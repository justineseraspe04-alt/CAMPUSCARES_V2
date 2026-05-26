-- Safe alignment migration for existing CampusCares Supabase / Hibernate databases.
-- Run once in Supabase SQL Editor. Does NOT drop tables.
-- Review each block; skip sections that already match your live schema.

-- ---------------------------------------------------------------------------
-- donations: item_condition -> condition (if legacy column exists)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'donations' AND column_name = 'item_condition'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'donations' AND column_name = 'condition'
    ) THEN
        ALTER TABLE donations RENAME COLUMN item_condition TO condition;
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- inventory_items: quantity_available -> quantity, item_condition -> condition
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'inventory_items' AND column_name = 'quantity_available'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'inventory_items' AND column_name = 'quantity'
    ) THEN
        ALTER TABLE inventory_items RENAME COLUMN quantity_available TO quantity;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'inventory_items' AND column_name = 'item_condition'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'inventory_items' AND column_name = 'condition'
    ) THEN
        ALTER TABLE inventory_items RENAME COLUMN item_condition TO condition;
    END IF;
END $$;

ALTER TABLE inventory_items
    ADD COLUMN IF NOT EXISTS source_donation_id BIGINT REFERENCES donations (id) ON DELETE SET NULL;

-- Non-negative quantity (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'inventory_items_quantity_non_negative'
    ) THEN
        ALTER TABLE inventory_items
            ADD CONSTRAINT inventory_items_quantity_non_negative CHECK (quantity >= 0);
    END IF;
EXCEPTION
    WHEN others THEN
        -- If column is still named quantity_available, add constraint on that column instead
        BEGIN
            ALTER TABLE inventory_items
                ADD CONSTRAINT inventory_items_quantity_available_non_negative
                CHECK (quantity_available >= 0);
        EXCEPTION
            WHEN others THEN NULL;
        END;
END $$;

-- ---------------------------------------------------------------------------
-- student_requests: ensure requested_item_name exists
-- ---------------------------------------------------------------------------
ALTER TABLE student_requests
    ADD COLUMN IF NOT EXISTS requested_item_name VARCHAR(255);

UPDATE student_requests
SET requested_item_name = COALESCE(requested_item_name, 'Unknown item')
WHERE requested_item_name IS NULL;

-- ---------------------------------------------------------------------------
-- distributions: request_id + distributed_at -> released_at
-- ---------------------------------------------------------------------------
ALTER TABLE distributions
    ADD COLUMN IF NOT EXISTS request_id BIGINT REFERENCES student_requests (id) ON DELETE SET NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'distributions' AND column_name = 'distributed_at'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'distributions' AND column_name = 'released_at'
    ) THEN
        ALTER TABLE distributions RENAME COLUMN distributed_at TO released_at;
    END IF;
END $$;

ALTER TABLE distributions
    ADD COLUMN IF NOT EXISTS released_at TIMESTAMPTZ DEFAULT NOW();

UPDATE distributions SET released_at = NOW() WHERE released_at IS NULL;

-- ---------------------------------------------------------------------------
-- notifications: recipient_email -> user_email, notification_type -> type
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'recipient_email'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'user_email'
    ) THEN
        ALTER TABLE notifications RENAME COLUMN recipient_email TO user_email;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'notification_type'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'type'
    ) THEN
        ALTER TABLE notifications RENAME COLUMN notification_type TO type;
    END IF;
END $$;

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT 'Notification';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(64) DEFAULT 'GENERAL';

UPDATE notifications SET title = 'Notification' WHERE title IS NULL OR title = '';
UPDATE notifications SET type = 'GENERAL' WHERE type IS NULL OR type = '';

-- ---------------------------------------------------------------------------
-- transaction_logs: performed_by + created_at
-- ---------------------------------------------------------------------------
ALTER TABLE transaction_logs ADD COLUMN IF NOT EXISTS performed_by VARCHAR(255);
ALTER TABLE transaction_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

UPDATE transaction_logs SET performed_by = 'SYSTEM' WHERE performed_by IS NULL OR performed_by = '';
UPDATE transaction_logs SET created_at = NOW() WHERE created_at IS NULL;

-- ---------------------------------------------------------------------------
-- users: full_name + created_at
-- ---------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

UPDATE users SET full_name = email WHERE full_name IS NULL OR full_name = '';
