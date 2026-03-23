import pool from '../../src/db.js';

async function setupUsers() {
  let connection;

  try {
    console.log('Setting up users...');
    connection = await pool.getConnection();

    // Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // Clear existing data
    await connection.query('DELETE FROM users');

    // Seed data
    const usersData = [
      ['John Doe', 'john@example.com', '555-0101'],
      ['Jane Smith', 'jane@example.com', '555-0102'],
      ['Mike Johnson', 'mike@example.com', '555-0103'],
      ['Sarah Williams', 'sarah@example.com', '555-0104'],
      ['Emma Brown', 'emma@example.com', '555-0105']
    ];

    for (const user of usersData) {
      await connection.query(
        'INSERT INTO users (name, email, phone, created_at) VALUES (?, ?, ?, NOW())',
        user
      );
    }

    console.log(`Users table ready. Added ${usersData.length} users\n`);
    return true;
  } catch (error) {
    console.error('Error setting up users:', error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

export default setupUsers;
