// src/pages/Dashboard.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import ReferralSystem from '../components/ReferralSystem';
import './Dashboard.css'; // Make sure to create this CSS file

function Dashboard() {
    const location = useLocation();
    const userData = location.state?.userData; // Access userData from state

    return (
        <div className="dashboard">
            <h2 className="dashboard-title">Dashboard</h2>
            {userData ? (
                <div className="dashboard-content">
                    <p>Welcome, <strong>{userData.first_name}</strong></p>
                    {/* Any other user-specific information can go here */}

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
            ) : (
                <p>No user data found. Please return to the main app.</p>
            )}
            <ReferralSystem userData={userData} />
        </div>
    );
}

export default Dashboard;
