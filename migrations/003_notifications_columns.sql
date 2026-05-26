-- Add notification columns missing from early Hibernate schemas.
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type VARCHAR(64);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_email VARCHAR(255);

UPDATE notifications SET title = COALESCE(NULLIF(TRIM(title), ''), 'Notification') WHERE title IS NULL;
UPDATE notifications SET notification_type = COALESCE(NULLIF(TRIM(notification_type), ''), 'GENERAL') WHERE notification_type IS NULL;
UPDATE notifications SET is_read = COALESCE(is_read, FALSE);
UPDATE notifications SET created_at = COALESCE(created_at, NOW()) WHERE created_at IS NULL;
