import React, { useEffect } from 'react';
import { init } from '@telegram-web-app/sdk';
import './HomePage.css';

const HomePage = () => {
    useEffect(() => {
        // Initialize the Telegram Web Apps SDK
        init();
    }, []);

    return (
        <div className="home-container">
            <h1>Welcome to CrownCoin</h1>
            <p>Your gateway to the most regal cryptocurrency experience.</p>
            {/* Removed the button that opens the bot, now handled by Telegram */}
            <div className="info-section">
                <h2>About CrownCoin</h2>
                <p>CrownCoin (CROWN) is a memecoin symbolizing status and rewards. Join the community, earn rewards, and be part of something royal.</p>
            </div>
        </div>
    );
};

export default HomePage;
