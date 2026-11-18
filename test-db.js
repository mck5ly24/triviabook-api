/*
 * Name: Ronald Hester Jr.
 * Date: 11.18.2026
 * CSC 372-01
 *
 * Tests the connection to my Neon PostgreSQL database.
 */

let pool = require('./db/database');

/**
 * Connects to Neon and displays the trivia topics.
 * @returns {Promise<void>} Completes after testing.
 */
async function testConnection() {
    try {
        let result = await pool.query('SELECT * FROM topics');

        console.log('Database connected successfully!');
        console.log(result.rows);
    } catch (error) {
        console.error('Database connection failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
    } finally {
        await pool.end();
    }
}

testConnection();
