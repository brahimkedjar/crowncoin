// webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN; // Use environment variable
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const API_URL = 'http://regestrationrenion.atwebpages.com/api_telegram.php'; // Update with your actual API URL

app.use(bodyParser.json());

// Webhook route
app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = message.chat.id;
        const username = message.from.username || "User";

        // Add the user to the API
        let userId;
        try {
            const response = await axios.post(API_URL, {
                action: 'create_user', // Ensure your API expects this action
                username: username
            });
            userId = response.data.userId; // Adjust based on your API's response structure
        } catch (error) {
            console.error("Error adding user:", error);
            return res.status(500).send({ message: "Error adding user." });
        }

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
            // Call the API to update the referral count
            await axios.post(API_URL, {
                action: 'update_referral_count', // Ensure your API expects this action
                user_id: userId
            });
            res.send({ message: "Referral tracked successfully!" });
        } catch (error) {
            console.error("Error tracking referral:", error);
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
