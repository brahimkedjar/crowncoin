const axios = require('axios'); // Ensure you have axios installed

const API_URL = 'http://regestrationrenion.atwebpages.com/api_telegram.php'; // Update with your actual API URL

// Function to update referral count
const updateReferralCount = async (userId) => {
    try {
        const response = await axios.post(API_URL, {
            action: 'update_referral_count',
            user_id: userId
        });
        return response.data; // Return the response from the API
    } catch (error) {
        console.error("Error updating referral count:", error);
        throw error; // Rethrow error for further handling
    }
};

// Function to add a new user
const addUser = async (username) => {
    try {
        const response = await axios.post(API_URL, {
            action: 'create_user',
            username: username
        });
        return response.data; // Return the response from the API
    } catch (error) {
        console.error("Error adding user:", error);
        throw error; // Rethrow error for further handling
    }
};

module.exports = { updateReferralCount, addUser }; // Export functions for use in webhook.js
