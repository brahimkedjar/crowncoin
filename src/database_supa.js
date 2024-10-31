const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://hfoqrjlsmwpwujqwgmds.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmb3FyamxzbXdwd3VqcXdnbWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzOTA3MjYsImV4cCI6MjA0NTk2NjcyNn0.Q6a-hT1xySKiWS5IHNkyqxI0CIbw_lylSDzih2Co8cc";
const supabase = createClient(supabaseUrl, supabaseKey);

// Check if a user exists by username and userId
const checkUserExists = async (username, userId) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('userId', userId)
            .limit(1);

        if (error) throw error;
        
        return data.length ? data[0] : null;
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
};

// Create a user if they don't already exist
const createUser = async (username, userId, referralCode) => {
    try {
        const existingUser = await checkUserExists(username, userId);
        if (existingUser) {
            return existingUser;
        }
        
        const { data, error } = await supabase
            .from('users')
            .insert([{ 
                username,
                userId,
                referralCount: 0,
                referredUsers: [],
                referralCode
            }])
            .select();

        if (error) throw error;

        return data[0];
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Increment referral count and save referred user's ID
const updateReferralCount = async (referralCode, referredUserId) => {
    try {
        // Retrieve the user with the given referralCode
        const { data: users, error: selectError } = await supabase
            .from('users')
            .select('id, referralCount, referredUsers')
            .eq('referralCode', referralCode)
            .limit(1);

        if (selectError) throw selectError;
        if (!users.length) {
            console.error("Referral user not found.");
            return;
        }

        const user = users[0];
        const updatedReferredUsers = [...user.referredUsers, referredUserId];

        // Update the referral count and referredUsers list
        const { error: updateError } = await supabase
            .from('users')
            .update({ 
                referralCount: user.referralCount + 1,
                referredUsers: updatedReferredUsers
            })
            .eq('id', user.id);

        if (updateError) throw updateError;
    } catch (error) {
        console.error("Error updating referral count:", error);
        throw error;
    }
};

// Retrieve a user by their userId
const getUser = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('userId', userId)
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
};

// Count total users in the database
const getUserCount = async () => {
    try {
        const { count, error } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        return count;
    } catch (error) {
        console.error("Error counting users:", error);
        throw error;
    }
};

// Get the leaderboard of users sorted by referralCount
const getLeaderboard = async (limitCount = 10) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('referralCount', { ascending: false })
            .limit(limitCount);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error retrieving leaderboard:", error);
        throw error;
    }
};

module.exports = {
    getLeaderboard,
    checkUserExists,
    createUser,
    getUser,
    updateReferralCount,
    getUserCount,
};
