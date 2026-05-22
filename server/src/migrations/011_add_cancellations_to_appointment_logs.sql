-- Database Migration: Add cancellations counter to appointment_logs

ALTER TABLE public.appointment_logs
ADD COLUMN IF NOT EXISTS cancellations integer NOT NULL DEFAULT 0;

UPDATE public.appointment_logs
SET cancellations = 0
WHERE cancellations IS NULL;