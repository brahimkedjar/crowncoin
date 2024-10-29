import React, { useEffect, useState } from 'react';
import { checkUserExists, createUser, getUser, updateReferralCount, getReferrals } from './database';
import './App.css';

const App = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const initApp = async () => {
            try {
                if (window.Telegram && window.Telegram.WebApp) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const initData = urlParams.get('initData');

                    if (initData) {
                        const parsedData = JSON.parse(decodeURIComponent(initData));
                        const user = parsedData.user;

                        setUserData(user);
                    } else {
                        setError("No initData found in the URL.");
                    }
                } else {
                    setError("Telegram Web App not initialized.");
                }
            } catch (error) {
                setError("An error occurred while initializing the Telegram Web App.");
            }
        };

        initApp();
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <img src="/path/to/crowncoin-icon.png" alt="CrownCoin" className="app-logo" />
                <h1 className="app-title">CrownCoin</h1>
                <p className="sub-text">Supported by TON, coming soon to top exchanges.</p>
            </header>

            {error ? (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            ) : (
                userData ? (
                    <div className="dashboard">
                        <h2 className="dashboard-title">Welcome, <strong>{userData.username}</strong></h2>
                        <div className="dashboard-content">
                            <div className="airdrop-info">
                                <h3>Airdrop & TGE Details</h3>
                                <p>The airdrop and TGE will activate at 1 million users. Share and invite friends to join the CrownCoin community!</p>
                            </div>
                            <div className="tasks-section">
                                <h3>Earn Rewards by Completing These Tasks:</h3>
                                <ul className="task-list">
                                    <li>
                                        <a href="https://example.com/like-page" target="_blank" rel="noopener noreferrer">
                                            <i className="task-icon fa fa-thumbs-up"></i> Like Our Facebook Page
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://example.com/join-telegram" target="_blank" rel="noopener noreferrer">
                                            <i className="task-icon fa fa-paper-plane"></i> Join Our Telegram Group
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://example.com/refer-friends" target="_blank" rel="noopener noreferrer">
                                            <i className="task-icon fa fa-user-friends"></i> Refer Friends to CrownCoin
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="error-message">Please join the bot to see your data.</p>
                )
            )}
        </div>
    );
};

export default App;
