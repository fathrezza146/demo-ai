#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

async function initDB() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default postgres DB first
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'demo_db']
    );

    if (dbExists.rowCount === 0) {
      // Create database
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'demo_db'}`);
      console.log(`Database ${(process.env.DB_NAME || 'demo_db')} created`);
    } else {
      console.log(`Database ${(process.env.DB_NAME || 'demo_db')} already exists`);
    }

    console.log('Database is ready. Run "npm run migrate" to apply schema migrations.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.end();
  }
}

initDB();
