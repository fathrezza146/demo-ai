const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'demo_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Express server with PostgreSQL is running!' });
});

// Example API endpoint that fetches data from PostgreSQL
app.get('/api/data', async (req, res) => {
  try {
    // Create a sample table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS demo_data (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        value INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert sample data if table is empty
    const countResult = await pool.query('SELECT COUNT(*) FROM demo_data');
    const count = parseInt(countResult.rows[0].count);
    
    if (count === 0) {
      await pool.query(
        'INSERT INTO demo_data (name, value) VALUES ($1, $2)',
        ['Sample Item', 42]
      );
    }
    
    // Fetch data from PostgreSQL
    const result = await pool.query('SELECT * FROM demo_data ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
