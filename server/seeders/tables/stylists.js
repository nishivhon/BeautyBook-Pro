import pool from '../src/db.js';

async function setupStylists() {
  let connection;

  try {
    console.log('Setting up stylists...');
    connection = await pool.getConnection();

    // Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stylists (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // Clear existing data
    await connection.query('DELETE FROM stylists');

    // Seed data
    const stylistsData = [
      ['Sarah Johnson', 'Hair Styling & Coloring', 'Expert in modern haircuts and color treatments'],
      ['Maria Garcia', 'Nail Specialist', 'Master of nail art and gel applications'],
      ['James Lee', 'Massage Therapy', 'Licensed massage therapist specializing in relaxation'],
      ['Jennifer White', 'Facial Treatments', 'Esthetician with 10+ years of skincare experience'],
      ['Adrian Martinez', 'General Beauty Services', 'Versatile beauty professional']
    ];

    for (const stylist of stylistsData) {
      await connection.query(
        'INSERT INTO stylists (name, specialization, bio, created_at) VALUES (?, ?, ?, NOW())',
        stylist
      );
    }

    console.log(`Stylists table ready. Added ${stylistsData.length} stylists\n`);
    return true;
  } catch (error) {
    console.error('Error setting up stylists:', error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

export default setupStylists;
