// src/database.js
const { db } = require("./firebase");
const { collection, addDoc, doc, getDoc, updateDoc, arrayUnion , query, where, getDocs } = require("firebase/firestore");

const usersCollection = collection(db, "users");

// Check if a user exists by username
const checkUserExists = async (username) => {
    try {
        const userQuery = query(usersCollection, where("username", "==", username));
        const querySnapshot = await getDocs(userQuery);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
};

// Create a user if they don't already exist
const createUser = async (username) => {
    try {
        const existingUser = await checkUserExists(username);
        if (existingUser) {
            // If user already exists, return their details instead of creating a new account
            return existingUser;
        }

        // Create a new user only if no existing user was found
        const newUser = await addDoc(usersCollection, { username, referralCount: 0 });
        return { id: newUser.id, username, referralCount: 0 };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Get a user by ID
const getUser = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            throw new Error("User not found.");
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const logReferralClick = async (referralCode, userId) => {
    const userRef = doc(db, 'users', referralCode); // Get the user by referral code
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
        // Increment referral count
        await updateDoc(userRef, {
            referrals: userSnapshot.data().referrals + 1,
            referralClicks: arrayUnion(userId) // Store the IDs of users who clicked
        });
    }
};

// Function to get referrals for a specific user
export const getReferrals = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
        return userSnapshot.data().referrals; // Return the number of referrals
    }
    
    return 0;
};

module.exports = { checkUserExists, createUser, getUser, getReferrals, logReferralClick };
