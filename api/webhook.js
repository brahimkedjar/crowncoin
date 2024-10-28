const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN; // Use environment variable
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

app.use(bodyParser.json());

// Middleware to handle user data storage (in-memory for simplicity)
let users = {}; // This could be replaced with a database for persistence

// Webhook route
app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = message.chat.id; // Use the correct chat ID

        // Store user data
        users[chatId] = {
            username: message.from.username || 'User',
            userId: message.from.id,
            joinedAt: new Date(), // You can store the date or year as needed
        };

        const responseText = `Welcome ${users[chatId].username}! Click the button below to open the CrownCoin app.`;

        const replyMarkup = {
            inline_keyboard: [
                [
                    {
                        text: "Open CrownCoin App",
                        web_app: { url: "https://crowncoin.vercel.app/" } // Your React app URL
                    }
                ]
            ]
        };

        try {
            // Send a message with a button that links to the React app
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
