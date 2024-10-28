// webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { db } = require('../src/firebase'); // Import Firebase Firestore
const { addDoc, collection, doc, increment, updateDoc } = require('firebase/firestore');

const app = express();
const port = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

app.use(bodyParser.json());

// Create a new user in Firestore
async function createUser(username) {
    try {
        const userRef = await addDoc(collection(db, 'users'), { username, referralCount: 0 });
        return { userId: userRef.id, username };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

// Update the referral count
async function updateReferralCount(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { referralCount: increment(1) });
        console.log("Referral count incremented for user:", userId);
    } catch (error) {
        console.error("Error updating referral count:", error);
        throw error;
    }
}

// Initialize the database (for testing only)
async function initializeDatabase() {
    try {
        const testUser = await createUser("TestUser");
        console.log("Database initialized with test user:", testUser);
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
}

// Webhook route
app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = message.chat.id;
        const username = message.from.username || "User";

        try {
            const userResponse = await createUser(username);
            const userId = userResponse.userId;

            const responseText = `Welcome ${username}! Click the button below to open the CrownCoin app.`;
            const initData = JSON.stringify({ user: { id: userId, username: username } });

            const replyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: "Open CrownCoin App",
                            web_app: { url: `https://crowncoin-git-main-brahimkedjar1s-projects.vercel.app/?initData=${encodeURIComponent(initData)}` }
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

// Referral tracking route
app.get('/referral', async (req, res) => {
    const referralCode = req.query.code;

    if (referralCode) {
        const [username, userId] = referralCode.split('-');

        try {
            await updateReferralCount(userId);
            res.send({ message: "Referral tracked successfully!" });
        } catch (error) {
            res.status(500).send({ message: "Server error." });
        }
    } else {
        res.status(400).send({ message: "Invalid referral code." });
    }
});

// Start the server and initialize the database
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await initializeDatabase();
});
