-- Create walk_in_logs table (similar to available_slots but without time_slot)
CREATE TABLE public.walk_in_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  date date NOT NULL,
  availability boolean NULL DEFAULT true,
  created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  customer_name text NULL,
  customer_contact text NULL,
  assigned_staff text NULL,
  services jsonb NULL DEFAULT '[]'::jsonb,
  status public.slot_status NULL DEFAULT 'pending'::slot_status,
  CONSTRAINT walk_in_logs_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_walk_in_logs_date 
  ON public.walk_in_logs USING btree (date) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_walk_in_logs_date_availability 
  ON public.walk_in_logs USING btree (date, availability) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_walk_in_logs_customer_name 
  ON public.walk_in_logs USING btree (customer_name) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_walk_in_logs_customer_contact 
  ON public.walk_in_logs USING btree (customer_contact) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_walk_in_logs_assigned_staff 
  ON public.walk_in_logs USING btree (assigned_staff) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_walk_in_logs_status 
  ON public.walk_in_logs USING btree (status) TABLESPACE pg_default;

-- Grant permissions if needed
GRANT ALL ON public.walk_in_logs TO authenticated;
