import React, { useEffect, useState } from 'react';
import {
    checkUserExists,
    createUser,
    getUser,
    updateReferralCount,
    getUserCount,
} from './database';
import './App.css';

const App = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [referralLink, setReferralLink] = useState('');
    const [remainingSpots, setRemainingSpots] = useState(1000000);

    useEffect(() => {
        const unsubscribeUserCount = getUserCount((userCount) => {
            setRemainingSpots(1000000 - userCount);
        });

        const initApp = async () => {
            try {
                if (window.Telegram && window.Telegram.WebApp) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const initData = urlParams.get('initData');
                    if (initData) {
                        const parsedData = JSON.parse(decodeURIComponent(initData));
                        const userId = parsedData.user.id;
                        setUserData(parsedData.user);

                        const botUsername = 'CROWNCOINOFFICIAL_bot';
                        setReferralLink(`https://t.me/${botUsername}?start=${parsedData.user.referralCode}`); // Use referralCode directly

                        // Check for a referral code in the URL
                        if (parsedData.referralCode) {
                            // Increment referral count for the user with this referral code
                            await updateReferralCount(parsedData.referralCode, userId);
                        }

                        const unsubscribeUserData = getUser(userId, (user) => setUserData(user));
                        return () => unsubscribeUserData();
                    } else {
                        setError("No initData found in the URL.");
                    }
                } else {
                    setError("Telegram Web App not initialized.");
                }
            } catch (error) {
                setError("An error occurred while initializing the app.");
            }
        };

        initApp();

        return () => unsubscribeUserCount();
    }, []);

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <img src="https://i.ibb.co/mXgX3pm/crown1.jpg" alt="CrownCoin" className="app-logo" />
                <h1 className="app-title">CrownCoin</h1>
                <p className="sub-text">Supported by TON, soon listed on major exchanges.</p>
                <p className="eligibility-message">🚀 Only the first 1 million users will be eligible for the airdrop! Join now!</p>
                <div className="countdown">
                    <h2>Remaining Spots:</h2>
                    <p className="countdown-number">{remainingSpots.toLocaleString()}</p>
                </div>
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
                            <div className="airdrop-info modern-section">
                                <h3>Airdrop & TGE Details</h3>
                                <p>To be eligible for rewards, please complete the tasks below:</p>
                            </div>
                            <div className="tasks-section modern-section">
                                <h3>Earn Rewards by Completing These Tasks:</h3>
                                <ul className="task-list">
                                <li>
                                        <a href="https://t.me/crowncointon" target="_blank" rel="noopener noreferrer" className="task-button">
                                            🚀 Join Our Telegram Group
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.instagram.com/crowncoin_by_ton?igsh=OHFvbDk2a3N5cW03" target="_blank" rel="noopener noreferrer" className="task-button">
                                            👍 Like Our Instagram Page
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://example.com/refer-friends" target="_blank" rel="noopener noreferrer" className="task-button">
                                            🤝 Refer Friends to CrownCoin
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="referral-section modern-section">
                                <h3>Your Referral Link</h3>
                                <p>Share this link to refer others:</p>
                                <input 
                                    type="text" 
                                    value={referralLink} 
                                    readOnly 
                                    className="referral-input"
                                />
                                <button onClick={handleCopyReferralLink} className="copy-referral-button">
                                    Copy Referral Link
                                </button>
                            </div>
                            <div className="referral-count-section modern-section">
                                <h3>Your Referral Count</h3>
                                <p>You have referred: {userData.referralCount || 0} users</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="loading-message">Loading user data...</div>
                )
            )}
        </div>
    );
};

export default App;
