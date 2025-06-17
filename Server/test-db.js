import pool from './db.js';

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');

    // Test a simple query
    const res = await client.query('SELECT NOW() as current_time');
    console.log('Current time from DB:', res.rows[0].current_time);

    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  } finally {
    await pool.end(); // Close the pool (only do this in a test script)
  }
}

testConnection();