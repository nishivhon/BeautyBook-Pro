-- Database Migration for Beauty Services
-- Run this in Supabase SQL Editor to create and populate the services table

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price FLOAT8 DEFAULT 0.00,
  est_time INT4,
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Insert all services
INSERT INTO services (category, name, description, price, est_time, availability) VALUES
-- Hair Services
('Hair Services', 'Hair cuts', 'Classic Haircut with Styling', 0.00, 45, true),
('Hair Services', 'Hair color', 'Full hair color service', 0.00, 90, true),
('Hair Services', 'Hair treatment', 'Full hair color service', 0.00, 60, true),
('Hair Services', 'Beard trimming', 'Trim and beard shaping', 0.00, 30, true),

-- Nail Services
('Nail Services', 'Manicure', 'Care & beautification for fingernails', 0.00, 40, true),
('Nail Services', 'Pedicure', 'Care & beautification for toenails', 0.00, 50, true),
('Nail Services', 'Nail enhancement', 'Artificial nail application', 0.00, 60, true),
('Nail Services', 'Nail art & design', 'Arts & Design for nails', 0.00, 55, true),

-- Skin Care Services
('Skin Care Services', 'Facial treatment', 'Care & beautification for face & skin', 0.00, 60, true),
('Skin Care Services', 'Advance treatment', 'High-tech solutions for skin concerns', 0.00, 75, true),
('Skin Care Services', 'Specialized facials', 'Targeted care for specific skin needs', 0.00, 60, true),
('Skin Care Services', 'Body treatment', 'Full-body skincare services', 0.00, 75, true),

-- Massage Services
('Massage Services', 'Swedish massage', 'Gently stroke for relaxation', 0.00, 60, true),
('Massage Services', 'Deep tissue massage', 'Intense pressure for muscle knots', 0.00, 60, true),
('Massage Services', 'Hot stone massage', 'Heated stones to melt tension', 0.00, 60, true),
('Massage Services', 'Foot reflexology', 'Pressure points for overall wellness', 0.00, 45, true),

-- Premium Services
('Premium Services', 'Bridal package', 'Full wedding day beauty', 0.00, 120, true),
('Premium Services', 'Couple''s Massage', 'Relaxation for 2', 0.00, 90, true),
('Premium Services', 'Hair & glow combo', 'Scalp treatment + facial', 0.00, 90, true),
('Premium Services', 'VIP experience', 'Private room + drinks', 0.00, 120, true)
ON CONFLICT DO NOTHING;
