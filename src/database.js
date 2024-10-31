const { db } = require("./firebase");
const { collection, addDoc, doc, orderBy, limit, updateDoc, arrayUnion, query, where, increment, getDocs, onSnapshot } = require("firebase/firestore");

const usersCollection = collection(db, "users");

const checkUserExists = async (username, userId) => {
    try {
        const userQuery = query(usersCollection, where("username", "==", username), where("userId", "==", userId));
        const querySnapshot = await getDocs(userQuery);
        return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    } catch (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
};

const createUser = async (username, userId, referralCode) => {
    try {
        const existingUser = await checkUserExists(username, userId);
        if (existingUser) return existingUser;

        const newUser = await addDoc(usersCollection, { 
            username, 
            userId,
            referralCount: 0,
            referredUsers: [],
            referralCode 
        });
        return { id: newUser.id, username, userId, referralCount: 0, referredUsers: [], referralCode };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

const getUser = (userId, setUserData) => {
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            setUserData({ id: doc.id, ...doc.data() });
        } else {
            console.log("No such user!");
        }
    });
    return unsubscribe;
};

const updateReferralCount = async (referralCode, userId) => {
    const userRef = doc(db, "users", referralCode);
    await updateDoc(userRef, {
        referralCount: increment(1),
        referredUsers: arrayUnion(userId)
    });
};

const getUserCount = (setUserCount) => {
    const userCountQuery = query(usersCollection);
    const unsubscribe = onSnapshot(userCountQuery, (snapshot) => {
        setUserCount(snapshot.docs.length);
    });
    return unsubscribe;
};

const getLeaderboard = async () => {
    const leaderboardQuery = query(usersCollection, orderBy("referralCount", "desc"), limit(10));
    const querySnapshot = await getDocs(leaderboardQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export { checkUserExists, createUser, getUser, updateReferralCount, getUserCount, getLeaderboard };
