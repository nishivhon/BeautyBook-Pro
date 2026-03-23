import pool from '../src/db.js';

async function setupAppointments() {
  let connection;

  try {
    console.log('Setting up appointments...');
    connection = await pool.getConnection();

    // Create table
    await connection.query(`
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
      ) ENGINE=InnoDB
    `);

    // Clear existing data
    await connection.query('DELETE FROM appointments');

    // Seed data
    const appointmentsData = [
      [1, 1, 1, '2025-12-25', '14:00:00', 'Please be on time', 'confirmed'],
      [2, 5, 2, '2025-12-26', '10:00:00', 'First time client', 'confirmed'],
      [3, 9, 3, '2025-12-27', '15:30:00', 'Deep tissue preferred', 'confirmed'],
      [4, 13, 4, '2025-12-28', '11:00:00', 'Sensitive skin', 'confirmed'],
      [5, 17, 5, '2025-12-29', '16:00:00', 'VIP package', 'confirmed']
    ];

    for (const appointment of appointmentsData) {
      await connection.query(
        'INSERT INTO appointments (user_id, service_id, stylist_id, appointment_date, appointment_time, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        appointment
      );
    }

    console.log(`Appointments table ready. Added ${appointmentsData.length} appointments\n`);
    return true;
  } catch (error) {
    console.error('Error setting up appointments:', error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

export default setupAppointments;
