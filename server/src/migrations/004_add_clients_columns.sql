-- Database Migration: Add total_clients and done_clients columns to staffs table
-- Run this in Supabase SQL Editor to add the new columns

-- Add new columns to staffs table
ALTER TABLE staffs
ADD COLUMN IF NOT EXISTS total_clients INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS done_clients INTEGER DEFAULT 0;

-- Create indexes for queries
CREATE INDEX IF NOT EXISTS idx_staffs_total_clients ON staffs(total_clients);
CREATE INDEX IF NOT EXISTS idx_staffs_done_clients ON staffs(done_clients);
