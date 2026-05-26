-- Run ONLY if Hibernate ddl-auto=update created duplicate nullable columns alongside legacy ones.
-- Backfills legacy columns then drops duplicates. Safe to skip if your DB never had duplicates.

-- donations: copy item_condition from condition if both exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'donations' AND column_name = 'condition')
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'donations' AND column_name = 'item_condition') THEN
        UPDATE donations SET item_condition = COALESCE(item_condition, condition) WHERE item_condition IS NULL;
        ALTER TABLE donations DROP COLUMN IF EXISTS condition;
    END IF;
END $$;

-- inventory_items
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_items' AND column_name = 'quantity')
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_items' AND column_name = 'quantity_available') THEN
        UPDATE inventory_items SET quantity_available = COALESCE(quantity_available, quantity) WHERE quantity_available IS NULL;
        ALTER TABLE inventory_items DROP COLUMN IF EXISTS quantity;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_items' AND column_name = 'condition')
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_items' AND column_name = 'item_condition') THEN
        UPDATE inventory_items SET item_condition = COALESCE(item_condition, condition) WHERE item_condition IS NULL;
        ALTER TABLE inventory_items DROP COLUMN IF EXISTS condition;
    END IF;
END $$;

-- notifications
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'user_email')
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'recipient_email') THEN
        UPDATE notifications SET recipient_email = COALESCE(recipient_email, user_email) WHERE recipient_email IS NULL;
        ALTER TABLE notifications DROP COLUMN IF EXISTS user_email;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'type')
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'notification_type') THEN
        UPDATE notifications SET notification_type = COALESCE(notification_type, type) WHERE notification_type IS NULL;
        ALTER TABLE notifications DROP COLUMN IF EXISTS type;
    END IF;
END $$;

-- distributions
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'distributions' AND column_name = 'released_at')
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'distributions' AND column_name = 'distributed_at') THEN
        UPDATE distributions SET distributed_at = COALESCE(distributed_at, released_at) WHERE distributed_at IS NULL;
        ALTER TABLE distributions DROP COLUMN IF EXISTS released_at;
    END IF;
END $$;
