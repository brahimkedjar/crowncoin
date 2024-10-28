const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || 'User';
    const telegramId = msg.from.id;
    const referrerId = msg.text.split(' ')[1]; // Capture referrer ID if provided

    // Register user for airdrop
    try {
        const response = await axios.post('http://localhost:5000/api/airdrop/register', {
            telegramId,
            username,
            referrerId: referrerId || null
        });

        bot.sendMessage(chatId, 'Welcome to the CrownCoin Airdrop! Complete tasks to earn coins.', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Join Group', callback_data: 'JOIN_GROUP' }],
                    [{ text: 'Like Page', callback_data: 'LIKE_PAGE' }],
                    [{ text: 'Invite Friends', callback_data: 'INVITE_FRIENDS' }]
                ]
            }
        });
    } catch (error) {
        bot.sendMessage(chatId, error.response.data.message);
    }
});
bot.on('callback_query', async (callbackQuery) => {
    const { data, message } = callbackQuery;
    const chatId = message.chat.id;
    const telegramId = message.from.id;

    if (data === 'JOIN_GROUP') {
        bot.sendMessage(chatId, 'Join this group: https://t.me/your_group_name and then click "Completed" below.', {
            reply_markup: {
                inline_keyboard: [[{ text: 'Completed', callback_data: 'JOIN_GROUP_DONE' }]]
            }
        });
    } else if (data === 'JOIN_GROUP_DONE') {
        // Mark the task as complete
        try {
            const response = await axios.post('http://localhost:5000/api/airdrop/complete_task', {
                telegramId,
                taskName: 'Join Group'
            });

            bot.sendMessage(chatId, response.data.message);
        } catch (error) {
            bot.sendMessage(chatId, error.response.data.message);
        }
    } else if (data === 'LIKE_PAGE') {
        bot.sendMessage(chatId, 'Like our Facebook page: https://facebook.com/your_page and click "Completed" below.', {
            reply_markup: {
                inline_keyboard: [[{ text: 'Completed', callback_data: 'LIKE_PAGE_DONE' }]]
            }
        });
    } else if (data === 'LIKE_PAGE_DONE') {
        try {
            const response = await axios.post('http://localhost:5000/api/airdrop/complete_task', {
                telegramId,
                taskName: 'Like Page'
            });

            bot.sendMessage(chatId, response.data.message);
        } catch (error) {
            bot.sendMessage(chatId, error.response.data.message);
        }
    } else if (data === 'INVITE_FRIENDS') {
        bot.sendMessage(chatId, `Invite your friends using this link: https://t.me/your_bot_name?start=${telegramId}`);
    }
});

bot.onText(/\/leaderboard/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const response = await axios.get('http://localhost:5000/api/airdrop/leaderboard');
        let leaderboardText = '🏆 Top Referrers 🏆\n\n';

        response.data.forEach((user, index) => {
            leaderboardText += `${index + 1}. ${user.username} - ${user.referralCount} invites\n`;
        });

        bot.sendMessage(chatId, leaderboardText);
    } catch (error) {
        bot.sendMessage(chatId, 'Failed to retrieve the leaderboard.');
    }
});


