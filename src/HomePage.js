import React from 'react';
import './HomePage.css';

const HomePage = () => {
    const handleStartClick = () => {
        window.open('https://t.me/CROWNCOINOFFICIAL_bot', '_blank');
    };

    return (
        <div className="home-container">
            <h1>Welcome to CrownCoin</h1>
            <p>Your gateway to the most regal cryptocurrency experience.</p>
            <button className="start-button" onClick={handleStartClick}>
                Start the Bot
            </button>
            <div className="info-section">
                <h2>About CrownCoin</h2>
                <p>CrownCoin (CROWN) is a memecoin symbolizing status and rewards. Join the community, earn rewards, and be part of something royal.</p>
            </div>
        </div>
    );
};

export default HomePage;
