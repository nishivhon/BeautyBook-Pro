-- Database Migration: Create coupons table
-- Stores coupon/discount codes with tracking for usage and validity

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  value_type VARCHAR(20) NOT NULL DEFAULT 'percentage' CHECK (value_type IN ('percentage', 'fixed')),
  value DECIMAL(10, 2) NOT NULL CHECK (value > 0), -- discount amount or percentage
  description TEXT,
  applicable_services INTEGER[] DEFAULT '{}', -- Array of service IDs this coupon applies to
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_uses INTEGER NOT NULL DEFAULT 0, -- Current number of times used
  max_uses INTEGER CHECK (max_uses IS NULL OR max_uses > 0), -- NULL = unlimited uses
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);
CREATE INDEX IF NOT EXISTS idx_coupons_start_date ON coupons(start_date);
CREATE INDEX IF NOT EXISTS idx_coupons_end_date ON coupons(end_date);
CREATE INDEX IF NOT EXISTS idx_coupons_is_deleted ON coupons(is_deleted);
