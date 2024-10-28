// webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { createUser, updateReferralCount } = require('../src/database'); // Import functions

const app = express();
const port = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

app.use(bodyParser.json());

// Initialize the database with a test user or perform other startup checks
async function initializeDatabase() {
    try {
        // Example: Create a test user or perform a simple check
        const response = await createUser("TestUser"); 
        console.log("Database initialized with test user:", response);
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
            // Add the user to the database
            const userResponse = await createUser(username);
            const userId = userResponse.userId;

            const responseText = `Welcome ${username}! Click the button below to open the CrownCoin app.`;
            const initData = JSON.stringify({ user: { id: userId, username: username } });

            const replyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: "Open CrownCoin App",
                            web_app: { url: `https://crowncoin-brahimkedjar1s-projects.vercel.app/?initData=${encodeURIComponent(initData)}` }
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

    res.sendStatus(200); // Respond to Telegram
});

// Endpoint to handle referral tracking
app.get('/referral', async (req, res) => {
    const referralCode = req.query.code;

    if (referralCode) {
        const [username, userId] = referralCode.split('-');

        try {
            await updateReferralCount(userId); // Increment referral count
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
    await initializeDatabase(); // Initialize the database when server starts
});
