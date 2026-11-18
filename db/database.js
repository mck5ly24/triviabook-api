/*
 * Name: Ronald Hester Jr.
 * Date: 11.18.2026
 * CSC 372-01
 *
 * Connects my Triviabook API to the
 * Neon PostgreSQL database.
 */

require('dotenv').config();

let { Pool } = require('pg');

// Create a connection pool using the Neon database URL.
let pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
