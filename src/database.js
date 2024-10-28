// src/database.js
import { db } from "./firebase";
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

const usersCollection = collection(db, "users");

// Create a user
export const createUser = async (username) => {
    try {
        const newUser = await addDoc(usersCollection, { username, referralCount: 0 });
        return { id: newUser.id, ...newUser.data() };
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
