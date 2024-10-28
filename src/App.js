// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css'; // Ensure your styles are modern and appealing

const App = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(''); // State to store any error messages

    useEffect(() => {
        const initApp = async () => {
            try {
                // Simulate fetching user data with mock data for testing
                const mockUserData = {
                    id: '12345',
                    first_name: 'John',
                    last_name: 'Doe',
                    username: 'johndoe'
                };

                // Set mock user data directly
                setUserData(mockUserData);
            } catch (error) {
                setError("An error occurred while initializing the Telegram Web App.");
            }
        };

        initApp();
    }, []);

    return (
        <div className="app-container">
            <h1 className="app-title">CrownCoin App</h1>
            {error ? (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            ) : (
                userData ? (
                    <div className="dashboard">
                        <h2 className="dashboard-title">Dashboard</h2>
                        <div className="dashboard-content">
                            <p>Welcome, <strong>{userData.first_name}</strong></p>
                            <div className="airdrop-info">
                                <h3>Airdrop and TGE Information</h3>
                                <p>The airdrop and TGE will start when the app reaches 1 million users. Invite your friends to help us reach this milestone!</p>
                            </div>
                            <div className="tasks-section">
                                <h3>Complete These Tasks to Earn Rewards:</h3>
                                <ul>
                                    <li>
                                        <a href="https://example.com/like-page" target="_blank" rel="noopener noreferrer">
                                            Like Our Facebook Page
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://example.com/join-telegram" target="_blank" rel="noopener noreferrer">
                                            Join Our Telegram Group
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://example.com/refer-friends" target="_blank" rel="noopener noreferrer">
                                            Refer Friends to the App
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
