const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const SUPABASE_URL  = "https://hfoqrjlsmwpwujqwgmds.supabase.co" ;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY ;
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const supabase = createClient(SUPABASE_URL , SUPABASE_ANON_KEY);
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// Helper function to generate a unique referral code
const generateReferralCode = () => Math.random().toString(36).substring(2, 10); 

// Check if a user exists by username
const checkUserExists = async (username) => {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('username', username)
        .limit(1)
        .single();

    if (error) {
        console.error("Error checking if user exists:", error);
        throw error;
    }
    return data || null;
};

// Create a user if they don't already exist
const createUser = async (username) => {
    const existingUser = await checkUserExists(username);
    if (existingUser) return existingUser;

    const newUserId = uuidv4(); 
    const { data, error } = await supabase
        .from('users')
        .insert({
            username,
            referralCode: newUserId,
            referralCount: 0,
            referredUsers: []
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating user:", error);
        throw error;
    }
    return data;
};

// Handle referral access by incrementing referral count and logging referred users
const handleReferralAccess = async (referralCode, newUserId) => {
    const { data: referrerData, error: referrerError } = await supabase
        .from('users')
        .select()
        .eq('referralCode', referralCode)
        .limit(1)
        .single();

    if (referrerError) {
        console.error("Error finding referrer:", referrerError);
        return;
    }

    if (!referrerData) {
        console.log("Referral code not found.");
        return;
    }

    const alreadyReferred = referrerData.referredUsers?.includes(newUserId);

    if (!alreadyReferred) {
        const { error: updateError } = await supabase
            .from('users')
            .update({
                referralCount: referrerData.referralCount + 1,
                referredUsers: [...referrerData.referredUsers, newUserId]
            })
            .eq('id', referrerData.id);

        if (updateError) {
            console.error("Error updating referral data:", updateError);
        } else {
            console.log(`Referral count incremented and user ${newUserId} added to referredUsers for referrer ${referrerData.id}`);
        }
    } else {
        console.log(`User ${newUserId} has already been referred by ${referrerData.id}`);
    }
};

app.post('/webhook', async (req, res) => {
    const { message } = req.body;

    if (message && message.text.startsWith('/start')) {
        const chatId = message.chat.id;
        const username = message.from.username || "User";
        const referralCode = message.text.split(' ')[1] || '';

        try {
            let user = await checkUserExists(username);
            if (!user) {
                user = await createUser(username);
            }

            if (referralCode && referralCode !== user.referralCode) {
                console.log(`Handling referral: ${referralCode} for user: ${username}`);
                await handleReferralAccess(referralCode, user.id);
            }

            const responseText = `Welcome ${username}! Click the button below to open the CrownCoin app.`;
            const initData = JSON.stringify({ user: { id: user.id, username, referral: user.referralCode } });

            const replyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: "Open CrownCoin App",
                            web_app: { url: `https://crowncoinbyton.vercel.app/?initData=${encodeURIComponent(initData)}` }
                        }
                    ],
                    [
                        {
                            text: "Join Our Community",
                            url: "https://t.me/crowncointon"
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
