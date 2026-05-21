-- Database Migration: Add clock_in, clock_out, and walk_in columns to staffs table
-- Run this in Supabase SQL Editor to add the new columns

-- Add new columns to staffs table
ALTER TABLE staffs
ADD COLUMN IF NOT EXISTS clock_in TIME,
ADD COLUMN IF NOT EXISTS clock_out TIME,
ADD COLUMN IF NOT EXISTS walk_in BOOLEAN DEFAULT false;

-- Create index for clock_in/clock_out queries
CREATE INDEX IF NOT EXISTS idx_staffs_clock_in ON staffs(clock_in);
CREATE INDEX IF NOT EXISTS idx_staffs_clock_out ON staffs(clock_out);
CREATE INDEX IF NOT EXISTS idx_staffs_walk_in ON staffs(walk_in);
