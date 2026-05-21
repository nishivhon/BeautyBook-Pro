-- Database Migration: Update in_service column constraint in staffs table
-- The in_service column already exists with in_service_status enum type
-- This migration ensures the enum includes all valid values

-- Add missing values to the in_service_status enum type if they don't exist
DO $$
BEGIN
    ALTER TYPE public.in_service_status ADD VALUE IF NOT EXISTS 'in-service';
    EXCEPTION WHEN duplicate_object THEN
        NULL;
END $$;

DO $$
BEGIN
    ALTER TYPE public.in_service_status ADD VALUE IF NOT EXISTS 'on-break';
    EXCEPTION WHEN duplicate_object THEN
        NULL;
END $$;

-- Update any invalid values to NULL
UPDATE public.staffs
SET in_service = NULL
WHERE in_service NOT IN ('avail', 'in-service', 'on-break');

