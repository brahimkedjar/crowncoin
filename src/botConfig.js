const axios = require('axios');

// Your Telegram Bot Token
const BOT_TOKEN = '7779305242:AAEGduHOqyH-HDxYCQb-NGPFu19DPTKglxA';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Function to handle the /start command
const sendWelcomeMessage = async (chatId) => {
    const welcomeMessage = "Welcome to CrownCoin Bot! 👑\n\nClick the button below to visit our website and learn more about CrownCoin.";

    // Button setup
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Visit CrownCoin Website 🌐",
                        url: "https://crowncoin-jduq6hatg-brahimkedjar1s-projects.vercel.app/"
                    }
                ]
            ]
        }
    };

    // Send the welcome message with the button
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: welcomeMessage,
        ...options
    });
};

// Function to process incoming bot messages
const processMessage = async (message) => {
    const chatId = message.chat.id;
    const text = message.text;

    if (text === '/start') {
        // Send welcome message when the /start command is received
        await sendWelcomeMessage(chatId);
    } else {
        // Handle other commands or messages
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: "Sorry, I don't understand this command. Try /start to see more options."
        });
    }
};

module.exports = { processMessage };
