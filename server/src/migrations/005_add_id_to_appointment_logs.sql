-- Database Migration: Add id column to appointment_logs table
-- This allows us to preserve the original slot IDs when archiving appointments

ALTER TABLE appointment_logs
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_appointment_logs_id ON appointment_logs(id);
