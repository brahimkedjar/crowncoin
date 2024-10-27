const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

app.use(bodyParser.json());

// Webhook route
app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text === '/start') {
        const chatId = message.chat.id;
        const responseText = 'Welcome to CrownCoin Bot! Click the button below to visit our app.';

        // Define inline keyboard button
        const replyMarkup = {
            inline_keyboard: [
                [
                    {
                        text: "Visit CrownCoin App",
                        url: "https://crowncoin-jduq6hatg-brahimkedjar1s-projects.vercel.app/"
                    }
                ]
            ]
        };

        // Send a message back to the user with the button
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: responseText,
            reply_markup: replyMarkup
        });
    }

    res.sendStatus(200); // Respond to Telegram
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
