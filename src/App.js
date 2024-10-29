import React, { useEffect, useState } from 'react';
import TonConnect from '@tonconnect/sdk';
import { checkUserExists, createUser, getUser, updateReferralCount, getReferrals } from './database';
import './App.css';

const App = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    useEffect(() => {
        const initApp = async () => {
            try {
                if (window.Telegram && window.Telegram.WebApp) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const initData = urlParams.get('initData');
                    if (initData) {
                        const parsedData = JSON.parse(decodeURIComponent(initData));
                        setUserData(parsedData.user);
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

    const connectToTonWallet = async () => {
        try {
            const tonConnect = new TonConnect({
                manifestUrl: 'https://tonwallet-two.vercel.app/tonconnect-manifest.json'  // Replace with your actual manifest URL
            });

            // Prompt the user to select a wallet
            await tonConnect.connectWallet();
            
            // Subscribe to connection events
            tonConnect.onStatusChange((status) => {
                if (status.wallet) {
                    setWalletAddress(status.wallet.address);  // Set the connected wallet address
                }
            });
        } catch (error) {
            setError("Failed to connect to TON Wallet.");
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
                                        <a href="https://example.com/like-page" target="_blank" rel="noopener noreferrer" className="task-button">
                                            👍 Like Our Facebook Page
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://example.com/join-telegram" target="_blank" rel="noopener noreferrer" className="task-button">
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
                                <button onClick={connectToTonWallet} className="connect-wallet-button">
                                    {walletAddress ? `Connected: ${walletAddress}` : 'Connect Wallet'}
                                </button>
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
