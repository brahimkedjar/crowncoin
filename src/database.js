// src/database.js
import { db } from "./firebase";
import { collection, addDoc, doc, getDoc, updateDoc, increment, query, where, getDocs } from "firebase/firestore";

const usersCollection = collection(db, "users");

// Check if a user exists by username
export const checkUserExists = async (username) => {
    try {
        const userQuery = query(usersCollection, where("username", "==", username));
        const querySnapshot = await getDocs(userQuery);
        
        if (!querySnapshot.empty) {
            // User exists, return their data
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        }
        // User does not exist
        return null;
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
};

// Create a user if they don't already exist
export const createUser = async (username) => {
    try {
        // Check if user already exists
        const existingUser = await checkUserExists(username);
        if (existingUser) {
            return existingUser; // Return existing user data if found
        }

        // User doesn't exist, create a new user
        const newUser = await addDoc(usersCollection, { username, referralCount: 0 });
        return { id: newUser.id, username, referralCount: 0 };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Get a user by ID
export const getUser = async (userId) => {
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
export const updateReferralCount = async (userId) => {
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
export const getReferrals = async (userId) => {
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
