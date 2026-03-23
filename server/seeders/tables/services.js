import pool from '../src/db.js';

async function setupServices() {
  let connection;

  try {
    console.log('Setting up services...');
    connection = await pool.getConnection();

    // Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        duration_minutes INT DEFAULT 30,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // Clear existing data
    await connection.query('DELETE FROM services');

    // Seed data
    const servicesData = [
      // Haircut services
      ['Classic Haircut', 'Standard haircut with wash and style', 'Haircut', 25.00, 30],
      ['Fade Haircut', 'Modern fade with clean lines', 'Haircut', 30.00, 35],
      ['Styling & Trim', 'Professional styling with trim', 'Haircut', 35.00, 45],
      ['Full Hair Makeover', 'Complete hair transformation', 'Haircut', 60.00, 60],

      // Nail services
      ['Basic Manicure', 'Nail cleaning and polish', 'Nails', 20.00, 30],
      ['Gel Manicure', 'Long-lasting gel polish', 'Nails', 40.00, 45],
      ['Nail Art Design', 'Custom nail art design', 'Nails', 50.00, 60],
      ['Pedicure & Manicure Combo', 'Full hand and foot care', 'Nails', 65.00, 75],

      // Massage services
      ['Swedish Massage', 'Relaxing full body massage', 'Massage', 80.00, 60],
      ['Deep Tissue Massage', 'Therapeutic deep tissue work', 'Massage', 90.00, 60],
      ['Hot Stone Massage', 'Relaxation with hot stones', 'Massage', 100.00, 60],
      ['Couples Massage', 'Couples massage package', 'Massage', 180.00, 60],

      // Skin care services
      ['Basic Facial', 'Cleansing and hydrating facial', 'Skin Care', 50.00, 45],
      ['Chemical Peel', 'Advanced skin treatment', 'Skin Care', 75.00, 50],
      ['Microdermabrasion', 'Deep exfoliation treatment', 'Skin Care', 70.00, 45],
      ['Anti-Aging Facial', 'Premium anti-aging treatment', 'Skin Care', 95.00, 60],

      // Premium services
      ['VIP Beauty Package', 'All-inclusive premium treatment', 'Premium', 200.00, 120],
      ['Bridal Package', 'Complete bridal preparation', 'Premium', 250.00, 180],
      ['Corporate Wellness', 'On-site wellness service', 'Premium', 150.00, 90]
    ];

    for (const service of servicesData) {
      await connection.query(
        'INSERT INTO services (name, description, category, price, duration_minutes, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        service
      );
    }

    console.log(`Services table ready. Added ${servicesData.length} services\n`);
    return true;
  } catch (error) {
    console.error('Error setting up services:', error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

export default setupServices;
