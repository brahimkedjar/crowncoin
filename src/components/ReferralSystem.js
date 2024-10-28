// referralService.js
const db = require('./database'); // Import the MySQL connection pool

// Function to update referral count
const updateReferralCount = async (userId) => {
    const connection = await db.getConnection();
    try {
        // Increment the referrer's referral count
        await connection.query('UPDATE users SET referral_count = referral_count + 1 WHERE id = ?', [userId]);
    } catch (error) {
        console.error("Error updating referral count:", error);
    } finally {
        connection.release();
    }
};

// Function to add a new user (if needed)
const addUser = async (username) => {
    const connection = await db.getConnection();
    try {
        // Insert a new user and return the ID
        const [result] = await connection.query('INSERT INTO users (username) VALUES (?)', [username]);
        return result.insertId;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error; // Rethrow error for further handling
    } finally {
        connection.release();
    }
};

module.exports = { updateReferralCount, addUser }; // Export functions for use in webhook.js
