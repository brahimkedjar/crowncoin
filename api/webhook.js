const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = '7779305242:AAEGduHOqyH-HDxYCQb-NGPFu19DPTKglxA'; // Replace with your actual bot token
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

app.use(bodyParser.json());

// Webhook route
app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = 6754210573;
        const responseText = 'Welcome to CrownCoin Bot! Click the button below to open the CrownCoin app.';

        const replyMarkup = {
            inline_keyboard: [
                [
                    {
                        text: "Open CrownCoin App",
                        url: "https://crowncoin-n9wnytey5-brahimkedjar1s-projects.vercel.app"
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
