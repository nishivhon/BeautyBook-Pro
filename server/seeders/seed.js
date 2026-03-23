import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import setupUsers from './tables/users.js';
import setupServices from './tables/services.js';
import setupStylists from './tables/stylists.js';
import setupAppointments from './tables/appointments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function createDatabase() {
  let connection;

  try {
    console.log('Creating database if it doesn\'t exist...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    const dbName = process.env.DB_NAME || 'beautybook_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' ready\n`);

    return true;
  } catch (error) {
    console.error('Error creating database:', error.message);
    return false;
  } finally {
    if (connection) await connection.end();
  }
}

async function runFullSetup() {
  try {
    console.log('Starting database setup and seeding...\n');

    // Step 1: Create Database
    console.log('STEP 1: Creating database');
    console.log('------------------------');
    const dbCreated = await createDatabase();
    if (!dbCreated) {
      console.error('Failed to create database');
      process.exit(1);
    }

    // Step 2: Create Tables and Seed Data
    console.log('STEP 2: Creating tables and seeding data');
    console.log('----------------------------------------');

    const usersSetup = await setupUsers();
    if (!usersSetup) {
      console.error('Failed to setup users');
      process.exit(1);
    }

    const servicesSetup = await setupServices();
    if (!servicesSetup) {
      console.error('Failed to setup services');
      process.exit(1);
    }

    const stylistsSetup = await setupStylists();
    if (!stylistsSetup) {
      console.error('Failed to setup stylists');
      process.exit(1);
    }

    const appointmentsSetup = await setupAppointments();
    if (!appointmentsSetup) {
      console.error('Failed to setup appointments');
      process.exit(1);
    }

    console.log('All setup steps completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

runFullSetup();
