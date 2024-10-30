// Firebase setup and utility functions
const { db } = require("./firebase");
const { collection, addDoc, doc, getDoc, updateDoc, arrayUnion, query, where, getDocs, onSnapshot, increment } = require("firebase/firestore");
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const usersCollection = collection(db, "users");

// Helper function to generate a unique referral code
const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 10); // Generates a random 8-character code
};

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
        
        const referralCode = generateReferralCode(); // Generate unique referral code
        const newUser = await addDoc(usersCollection, { 
            username, 
            referralCode, 
            referralCount: 0, 
            referredUsers: [] // Array to store users who used this user's referral code
        });
        return { id: newUser.id, username, referralCode, referralCount: 0, referredUsers: [] };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Log a referral click and update count and referred users
const logReferralClick = async (referralCode, referredUserName) => {
    try {
        const userQuery = query(usersCollection, where("referralCode", "==", referralCode));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userRef = doc(db, "users", userDoc.id);

            await updateDoc(userRef, {
                referralCount: increment(1),
                referredUsers: arrayUnion(referredUserName) // Add the referred user's name
            });
        } else {
            console.error("Referral user does not exist.");
        }
    } catch (error) {
        console.error("Error logging referral click:", error);
    }
};

app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text.startsWith('/start')) {
        const chatId = message.chat.id;
        const username = message.from.username || "User";
        const referralCode = message.text.split(' ')[1] || ''; // Retrieve referral code if provided

        try {
            // Check if user exists or create new one
            let user = await checkUserExists(username);
            if (!user) {
                user = await createUser(username); // Generate a new user and referral code
            }

            // Log referral if a valid code is provided and isn't self-referral
            if (referralCode && referralCode !== user.referralCode) {
                await logReferralClick(referralCode, username);
            }

            // Send response with welcome message and referral link
            const responseText = `Welcome ${username}! Click the button below to open the CrownCoin app.`;
            const initData = JSON.stringify({ user: { id: user.id, username } });

            const replyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: "Open CrownCoin App",
                            web_app: { url: `https://crowncoinbyton.vercel.app/?initData=${encodeURIComponent(initData)}` }
                        }
                    ]
                ]
            };

            await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
                chat_id: chatId,
                text: responseText,
                reply_markup: replyMarkup
            });
            console.log("Message sent successfully with button");
        } catch (error) {
            console.error("Error in /start command:", error);
        }
    }

    res.sendStatus(200);
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
