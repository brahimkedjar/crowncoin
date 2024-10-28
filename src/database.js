const axios = require('axios');

const API_URL = 'http://regestrationrenion.atwebpages.com/api_telegram.php'; // Update with your actual API URL

const createUser = async (username) => {
    try {
        const response = await axios.post(API_URL, {
            action: 'create_user',
            username: username
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

const updateReferralCount = async (userId) => {
    try {
        const response = await axios.post(API_URL, {
            action: 'update_referral_count',
            user_id: userId
        });
        return response.data;
    } catch (error) {
        console.error("Error updating referral count:", error);
        throw error;
    }
};

const getUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}?action=get_user&id=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

const getReferrals = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}?action=get_referrals&user_id=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching referrals:", error);
        throw error;
    }
};

module.exports = {
    createUser,
    updateReferralCount,
    getUser,
    getReferrals
};
