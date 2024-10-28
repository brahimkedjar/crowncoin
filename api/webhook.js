// webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN; // Use environment variable
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

app.use(bodyParser.json());

// Store users to keep track of them
const users = {}; // You might want to persist this data in a database

// Webhook route
app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = message.chat.id;
        const username = message.from.username || "User";

        // Store the user information
        users[chatId] = { username: username };

        const responseText = `Welcome ${username}! Click the button below to open the CrownCoin app.`;
const initData = JSON.stringify({ user: users[chatId] }); // Prepare the user data

const replyMarkup = {
    inline_keyboard: [
        [
            {
                text: "Open CrownCoin App",
                web_app: { url: `https://crowncoin.vercel.app/?initData=${encodeURIComponent(initData)}` } // Pass initData in the URL
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

// New route to get user data
app.get('/users/:chatId', (req, res) => {
    const chatId = req.params.chatId;
    if (users[chatId]) {
        res.json(users[chatId]);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
