const { db } = require("./firebase");
const { collection, addDoc, doc, orderBy, limit, updateDoc, arrayUnion, query, where, increment, getDocs, onSnapshot } = require("firebase/firestore");

const usersCollection = collection(db, "users");
const checkUserExists = async (username, userId) => {
    try {
        const userQuery = query(usersCollection, where("username", "==", username), where("userId", "==", userId));
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

// Consolidate referral and new user data updates for batch processing
const updateReferralCount = async (referralCode, referredUserId) => {
    try {
        const userQuery = query(usersCollection, where("referralCode", "==", referralCode));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userRef = doc(db, "users", userDoc.id);

            await updateDoc(userRef, {
                referralCount: increment(1),
                referredUsers: arrayUnion(referredUserId)
            });
        } else {
            console.error("Referral user not found.");
        }
    } catch (error) {
        console.error("Error updating referral count:", error);
    }
};
// Create a user if they don't already exist
const createUser = async (username, userId, referralCode) => {
    try {
        const existingUser = await checkUserExists(username, userId);
        if (existingUser) {
            return existingUser; // Return existing user
        }
        
        const newUser = await addDoc(usersCollection, { 
            username, 
            userId, // Save userId here
            referralCount: 0, 
            referredUsers: [], // Array to store users who used this user's referral code
            referralCode // Store unique referral code
        });
        return { id: newUser.id, username, userId, referralCount: 0, referredUsers: [], referralCode };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};


// Retrieve user by their userId
const getUser = async (userId, callback) => {
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        } else {
            console.error("No such user!");
            callback(null);
        }
    });
    return unsubscribe; // Return unsubscribe function for cleanup
};

// Count total users in the database
const getUserCount = (callback) => {
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        callback(snapshot.docs.length);
    });
    return unsubscribe; // Return unsubscribe function for cleanup
};
// Get the leaderboard of users sorted by referralCount
const getLeaderboard = async (limitCount = 10) => {
    try {
        // Create a query to get users sorted by referralCount in descending order
        const leaderboardQuery = query(
            usersCollection,
            orderBy("referralCount", "desc"), // Sort by referral count
            limit(limitCount) // Limit the number of results
        );

        const querySnapshot = await getDocs(leaderboardQuery);
        const leaderboard = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return leaderboard; // Return the leaderboard data
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