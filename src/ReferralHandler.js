// src/ReferralHandler.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { logReferralClick } from './database'; // Adjust the path as necessary

const ReferralHandler = () => {
    const { referralCode } = useParams();

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Assuming you have a way to get user ID
        if (userId) {
            logReferralClick(referralCode, userId)
                .then(() => {
                    // Optionally, redirect or show a success message
                    window.location.href = 'https://t.me/CROWNCOINOFFICIAL_bot'; // Open Telegram bot
                })
                .catch((error) => {
                    console.error("Error logging referral click:", error);
                });
        }
    }, [referralCode]);

    return <div>Logging your referral...</div>;
};

export default ReferralHandler;
