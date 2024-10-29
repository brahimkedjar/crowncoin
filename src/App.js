import React, { useEffect, useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';
import './App.css';

const App = () => {
    const [userData, setUserData] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');
    const tonConnect = new TonConnect({ manifestUrl: 'https://crowncoinbyton.vercel.app/tonconnect-manifest.json' });

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
            const connection = await tonConnect.connectWallet();
            if (connection.status === 'connected') {
                setWalletAddress(connection.wallet.address);
            } else {
                setError("Failed to connect to TON Wallet.");
            }
        } catch (error) {
            setError("Failed to connect to TON Wallet.");
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <img src="/images/crown1.jpg" alt="CrownCoin" className="app-logo" />
                <h1 className="app-title">CrownCoin</h1>
                <p className="sub-text">Supported by TON, soon listed on major exchanges.</p>
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
                            <h3>Connect to TON Wallet</h3>
                            <button onClick={connectToTonWallet} className="connect-wallet-button">
                                {walletAddress ? `Connected: ${walletAddress}` : 'Connect Wallet'}
                            </button>
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
