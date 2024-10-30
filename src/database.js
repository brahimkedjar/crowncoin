const { db } = require("./firebase");
const { collection, addDoc, doc, getDoc, updateDoc, arrayUnion, query, where, increment, getDocs, onSnapshot } = require("firebase/firestore");

const usersCollection = collection(db, "users");

const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 10);
};

// Check if user exists by username
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

// Create new user and initialize with referral code
const createUser = async (username) => {
    try {
        const existingUser = await checkUserExists(username);
        if (existingUser) {
            return existingUser;
        }

        const referralCode = generateReferralCode();
        const newUser = await addDoc(usersCollection, {
            username,
            referralCode,
            referralCount: 0,
            referredUsers: [] 
        });
        return { id: newUser.id, username, referralCode, referralCount: 0, referredUsers: [] };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};


// Log referral click and increment count
const logReferralClick = async (referralCode, referredUserName) => {
    try {
        const userQuery = query(usersCollection, where("referralCode", "==", referralCode));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userRef = doc(db, "users", userDoc.id);

            await updateDoc(userRef, {
                referralCount: increment(1),
                referredUsers: arrayUnion(referredUserName)
            });
            console.log(`Referral count incremented for user with code: ${referralCode}`);
        } else {
            console.error("Referral user not found.");
        }
    } catch (error) {
        console.error("Error logging referral click:", error);
    }
};
// Function to get referrals for a specific user
const getReferrals = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            return {
                referralCount: data.referralCount || 0,
                referredUsers: data.referredUsers || []
            };
        } else {
            throw new Error("User not found.");
        }
    } catch (error) {
        console.error("Error fetching referrals:", error);
        throw error;
    }
};

const getUserCount = (callback) => {
    try {
        return onSnapshot(usersCollection, (snapshot) => {
            callback(snapshot.size);
        });
    } catch (error) {
        console.error("Error getting user count:", error);
    }
};

// Get real-time updates for a specific user by ID
const getUser = (userId, callback) => {
    try {
        const userRef = doc(db, "users", userId);
        return onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({ id: userId, ...docSnap.data() });
            } else {
                console.error("User not found.");
            }
        });
    } catch (error) {
        console.error("Error fetching user:", error);
    }
};

module.exports = { checkUserExists, createUser, getUser, getReferrals, logReferralClick, getUserCount };
