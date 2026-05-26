-- Database Migration: Create secured_credentials table
-- Stores operator login credentials with bcrypt-hashed passwords

CREATE TABLE IF NOT EXISTS secured_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'staff', 'super admin')),
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_secured_credentials_role ON secured_credentials(role);
CREATE INDEX IF NOT EXISTS idx_secured_credentials_is_active ON secured_credentials(is_active);

INSERT INTO secured_credentials (email, role, password_hash, is_active)
VALUES
  ('admin@beautybook.pro', 'admin', '$2b$10$50.fZzFwhiNMR4DHDif3NOHiKpIWgeb6dEAzGVM45qXMcbdeCkjOG', TRUE),
  ('staff@beautybook.pro', 'staff', '$2b$10$0oHIq85t6XwS6Mgusv.xkeGOquuiYYAScqnI0nI7T/H6A.Bwo.fge', TRUE),
  ('superadmin@beautybook.pro', 'super admin', '$2b$10$4uVEwBJ65.6RMQXxWz1WBOUcgp60Aby4bSYasN0e3mcp9EFDvz9PO', TRUE)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;