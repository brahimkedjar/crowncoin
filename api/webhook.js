// webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { updateReferralCount, addUser } = require('../src/components/ReferralSystem'); // Import referral logic
const db = require('../src/database'); // Import the MySQL connection

const app = express();
const port = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN; // Use environment variable
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

app.use(bodyParser.json());

// Webhook route
app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = message.chat.id;
        const username = message.from.username || "User";

        // Add the user to the database
        const userId = await addUser(username);

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

        try {
            await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
                chat_id: chatId,
                text: responseText,
                reply_markup: replyMarkup
            });
            console.log("Message sent successfully with button");
        } catch (error) {
            console.error("Error sending message:", error);
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
            // Here, you can add logic to check if this referral is valid
            // Increment the referrer's count
            await updateReferralCount(userId); // This function handles the database logic
            res.send({ message: "Referral tracked successfully!" });
        } catch (error) {
            res.status(500).send({ message: "Server error." });
        }
    } else {
        res.status(400).send({ message: "Invalid referral code." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
