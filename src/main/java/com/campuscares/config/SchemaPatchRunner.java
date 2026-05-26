package com.campuscares.config;

import com.campuscares.util.PickupReferenceGenerator;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Applies safe idempotent DDL patches so Supabase schemas created by older Hibernate
 * versions stay compatible with current entities (no table drops).
 */
@Component
public class SchemaPatchRunner implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(SchemaPatchRunner.class);

    private final JdbcTemplate jdbcTemplate;

    public SchemaPatchRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        patchNotifications();
        patchDistributions();
        patchInventory();
    }

    private void patchNotifications() {
        try {
            jdbcTemplate.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title VARCHAR(255)");
            jdbcTemplate.execute(
                    "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type VARCHAR(64)");
            jdbcTemplate.execute(
                    "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_email VARCHAR(255)");
            jdbcTemplate.update(
                    "UPDATE notifications SET title = 'Notification' WHERE title IS NULL OR TRIM(title) = ''");
            jdbcTemplate.update(
                    "UPDATE notifications SET notification_type = 'GENERAL' "
                            + "WHERE notification_type IS NULL OR TRIM(notification_type) = ''");
            jdbcTemplate.update("UPDATE notifications SET is_read = FALSE WHERE is_read IS NULL");
        } catch (Exception ex) {
            log.warn("Notification schema patch skipped: {}", ex.getMessage());
        }
    }

    private void patchDistributions() {
        try {
            jdbcTemplate.execute(
                    "ALTER TABLE distributions ADD COLUMN IF NOT EXISTS request_id BIGINT");
            jdbcTemplate.execute(
                    "ALTER TABLE distributions ADD COLUMN IF NOT EXISTS distributed_at TIMESTAMPTZ");
            jdbcTemplate.execute(
                    "ALTER TABLE distributions ADD COLUMN IF NOT EXISTS pickup_reference_number VARCHAR(50)");
            jdbcTemplate.update(
                    "UPDATE distributions SET distributed_at = NOW() WHERE distributed_at IS NULL");
            jdbcTemplate.execute(
                    "CREATE UNIQUE INDEX IF NOT EXISTS idx_distributions_pickup_reference_number "
                            + "ON distributions(pickup_reference_number) "
                            + "WHERE pickup_reference_number IS NOT NULL");
            backfillPickupReferences();
        } catch (Exception ex) {
            log.warn("Distribution schema patch skipped: {}", ex.getMessage());
        }
    }

    private void backfillPickupReferences() {
        List<Long> ids = jdbcTemplate.queryForList(
                "SELECT id FROM distributions WHERE pickup_reference_number IS NULL "
                        + "OR TRIM(pickup_reference_number) = ''",
                Long.class);
        for (Long id : ids) {
            String reference = generateUniquePickupReference();
            jdbcTemplate.update(
                    "UPDATE distributions SET pickup_reference_number = ? WHERE id = ?",
                    reference,
                    id);
        }
    }

    private String generateUniquePickupReference() {
        for (int attempt = 0; attempt < 12; attempt++) {
            String candidate = PickupReferenceGenerator.generatePickupReferenceNumber();
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM distributions WHERE pickup_reference_number = ?",
                    Integer.class,
                    candidate);
            if (count != null && count == 0) {
                return candidate;
            }
        }
        return PickupReferenceGenerator.generatePickupReferenceNumber() + "X";
    }

    private void patchInventory() {
        try {
            jdbcTemplate.execute(
                    "ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS source_donation_id BIGINT");
        } catch (Exception ex) {
            log.warn("Inventory schema patch skipped: {}", ex.getMessage());
        }
    }
}
