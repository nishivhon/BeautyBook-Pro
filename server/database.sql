-- BeautyBook Pro Database Schema
-- Run this in SQLyog to set up your database

CREATE DATABASE IF NOT EXISTS beautybook_db;
USE beautybook_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stylists table
CREATE TABLE IF NOT EXISTS stylists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  service_id INT NOT NULL,
  stylist_id INT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (stylist_id) REFERENCES stylists(id) ON DELETE SET NULL
);

-- Insert sample services based on your app
INSERT INTO services (name, description, category, price, duration_minutes) VALUES
-- Haircut services
('Classic Haircut', 'Standard haircut with wash and style', 'Haircut', 25.00, 30),
('Fade Haircut', 'Modern fade with clean lines', 'Haircut', 30.00, 35),
('Styling & Trim', 'Professional styling with trim', 'Haircut', 35.00, 45),
('Full Hair Makeover', 'Complete hair transformation', 'Haircut', 60.00, 60),

-- Nail services
('Basic Manicure', 'Nail cleaning and polish', 'Nails', 20.00, 30),
('Gel Manicure', 'Long-lasting gel polish', 'Nails', 40.00, 45),
('Nail Art Design', 'Custom nail art design', 'Nails', 50.00, 60),
('Pedicure & Manicure Combo', 'Full hand and foot care', 'Nails', 65.00, 75),

-- Massage services
('Swedish Massage', 'Relaxing full body massage', 'Massage', 80.00, 60),
('Deep Tissue Massage', 'Therapeutic deep tissue work', 'Massage', 90.00, 60),
('Hot Stone Massage', 'Relaxation with hot stones', 'Massage', 100.00, 60),
('Couples Massage', 'Couples massage package', 'Massage', 180.00, 60),

-- Skin care services
('Basic Facial', 'Cleansing and hydrating facial', 'Skin Care', 50.00, 45),
('Chemical Peel', 'Advanced skin treatment', 'Skin Care', 75.00, 50),
('Microdermabrasion', 'Deep exfoliation treatment', 'Skin Care', 70.00, 45),
('Anti-Aging Facial', 'Premium anti-aging treatment', 'Skin Care', 95.00, 60),

-- Premium services
('VIP Beauty Package', 'All-inclusive premium treatment', 'Premium', 200.00, 120),
('Bridal Package', 'Complete bridal preparation', 'Premium', 250.00, 180),
('Corporate Wellness', 'On-site wellness service', 'Premium', 150.00, 90);

-- Insert sample stylists
INSERT INTO stylists (name, specialization, bio) VALUES
('Sarah Johnson', 'Hair Styling & Coloring', 'Expert in modern haircuts and color treatments'),
('Maria Garcia', 'Nail Specialist', 'Master of nail art and gel applications'),
('James Lee', 'Massage Therapy', 'Licensed massage therapist specializing in relaxation'),
('Jennifer White', 'Facial Treatments', 'Esthetician with 10+ years of skincare experience'),
('Adrian Martinez', 'General Beauty Services', 'Versatile beauty professional');

-- Create indexes for better performance
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);
CREATE INDEX idx_appointments_stylist_id ON appointments(stylist_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_services_category ON services(category);
