-- Safe migration: pickup reference numbers for item releases
ALTER TABLE distributions
ADD COLUMN IF NOT EXISTS pickup_reference_number VARCHAR(50);

CREATE UNIQUE INDEX IF NOT EXISTS idx_distributions_pickup_reference_number
ON distributions(pickup_reference_number)
WHERE pickup_reference_number IS NOT NULL;
