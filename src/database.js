// database.js
const mysql = require('mysql2/promise'); // Use promise-based MySQL library

// Create a connection pool
const pool = mysql.createPool({
    host: 'fdb1034.awardspace.net', // Your database host
    user: '4481491_gestionrenion', // Your database username
    password: 'crb12345', // Your database password
    database: '4481491_gestionrenion' // Your database name
});

// Create tables if they do not exist
const createTables = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users_bot (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                referral_count INT DEFAULT 0
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS referrals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                referrer_id INT,
                referee_id INT,
                FOREIGN KEY (referrer_id) REFERENCES users(id),
                FOREIGN KEY (referee_id) REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        connection.release();
    }
};

// Initialize the database and create tables
createTables();

module.exports = pool; // Export the pool for use in other modules
