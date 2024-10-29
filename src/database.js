// src/database.js
const { db } = require("./firebase");
const { collection, addDoc, doc, getDoc, updateDoc, increment, query, where, getDocs } = require("firebase/firestore");

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
            return existingUser;
        }

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

// Update referral count
const updateReferralCount = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { referralCount: increment(1) });
        return { message: "Referral count updated successfully." };
    } catch (error) {
        console.error("Error updating referral count:", error);
        throw error;
    }
};

// Get referrals for a user
const getReferrals = async (userId) => {
    try {
        const referralsQuery = query(collection(db, "referrals"), where("referrerId", "==", userId));
        const querySnapshot = await getDocs(referralsQuery);
        const referrals = querySnapshot.docs.map(doc => doc.data());
        return referrals;
    } catch (error) {
        console.error("Error fetching referrals:", error);
        throw error;
    }
};

module.exports = { checkUserExists, createUser, getUser, updateReferralCount, getReferrals };
