import React, { useEffect, useState } from 'react';
import {
    checkUserExists,
    createUser,
    getUser,
    updateReferralCount,
    getReferrals,
    logReferralClick,
} from './database';
import './App.css';
// Removed ReferralHandler import

const App = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [manualWalletAddress, setManualWalletAddress] = useState('');
    const [referralLink, setReferralLink] = useState('');

    useEffect(() => {
        const initApp = async () => {
            try {
                if (window.Telegram && window.Telegram.WebApp) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const initData = urlParams.get('initData');
                    if (initData) {
                        const parsedData = JSON.parse(decodeURIComponent(initData));
                        setUserData(parsedData.user);
                        // Generate the referral link
                        const referralCode = parsedData.user.referralCode; // Assuming the referral code is stored in user data
                        setReferralLink(`${window.location.origin}/referral/${referralCode}`);
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

    const handleReferralClick = async (referralCode) => {
        const userId = userData.id; // Assuming userId is in userData
        await logReferralClick(referralCode, userId);
        // Optionally, open the Telegram bot
        window.open('https://t.me/CROWNCOINOFFICIAL_bot'); // Replace with your bot's username
    };

    const handleManualWalletSubmit = () => {
        if (manualWalletAddress) {
            setWalletAddress(manualWalletAddress);
            localStorage.setItem('walletAddress', manualWalletAddress);
            setManualWalletAddress('');
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <img src="https://i.ibb.co/mXgX3pm/crown1.jpg" alt="CrownCoin" className="app-logo" />
                <h1 className="app-title">CrownCoin</h1>
                <p className="sub-text">Supported by TON, soon listed on major exchanges.</p>
                <p className="eligibility-message">🚀 Only the first 1 million users will be eligible for the airdrop! Join now!</p>
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
                                        <a href="https://www.instagram.com/crowncoin_by_ton/profilecard/?igsh=OHFvbDk2a3N5cW03" target="_blank" rel="noopener noreferrer" className="task-button">
                                            👍 Like Our Instagram Page
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://t.me/crowncointon" target="_blank" rel="noopener noreferrer" className="task-button">
                                            🚀 Join Our Telegram Group
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://example.com/refer-friends" target="_blank" rel="noopener noreferrer" className="task-button">
                                            🤝 Refer Friends to CrownCoin
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="wallet-section modern-section">
                                <h3>Connect to TON Wallet</h3>
                                <div className="manual-wallet-input">
                                    <input 
                                        type="text" 
                                        placeholder="Paste your wallet address" 
                                        value={manualWalletAddress} 
                                        onChange={(e) => setManualWalletAddress(e.target.value)} 
                                        className="wallet-input" 
                                    />
                                    <button onClick={handleManualWalletSubmit} className="save-wallet-button">
                                        Save Wallet Address
                                    </button>
                                </div>
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
                                <button onClick={() => navigator.clipboard.writeText(referralLink)} className="copy-referral-button">
                                    Copy Referral Link
                                </button>
                            </div>

                            <div className="referral-click-section modern-section">
                                <h3>Log a Referral Click</h3>
                                <input 
                                    type="text" 
                                    placeholder="Enter Referral Code" 
                                    onChange={(e) => handleReferralClick(e.target.value)} 
                                    className="referral-code-input" 
                                />
                            </div>

                            <div className="referral-count-section modern-section">
                                <h3>Your Referral Count</h3>
                                <p>You have referred: {userData.referrals} users</p>
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
