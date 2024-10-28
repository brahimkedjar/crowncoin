// src/App.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import ReferralSystem from './components/ReferralSystem';
import { db } from './firebase'; // Import Firebase Firestore
import { doc, getDoc } from 'firebase/firestore';
import './App.css'; // Ensure your styles are modern and appealing

const App = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const urlParams = new URLSearchParams(window.location.search);
            const initData = urlParams.get('initData');

            if (initData) {
                const parsedData = JSON.parse(decodeURIComponent(initData));
                const user = parsedData.user;

                setUserData(user);
                console.log('User data:', user);
                setTimeout(() => {
                    setLoading(false);
                    navigate('/dashboard', { state: { userData: user } });
                }, 2000); // 2 seconds delay to simulate loading
            } else {
                console.log("No initData found in the URL.");
                setLoading(false);
            }
        } else {
            console.error("Telegram Web App not initialized.");
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch user data from Firebase Firestore
        const fetchUserData = async () => {
            if (userData && userData.id) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', userData.id));
                    if (userDoc.exists()) {
                        setUserData(prevUserData => ({ ...prevUserData, ...userDoc.data() }));
                    } else {
                        console.log("No such user!");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUserData();
    }, [userData]);

    return (
        <div className="app-container">
            <h1 className="app-title">CrownCoin App</h1>
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-circle"></div>
                    <p>Loading your data...</p>
                </div>
            ) : (
                userData ? (
                    <div className="dashboard">
                        <h2 className="dashboard-title">Dashboard</h2>
                        {userData ? (
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
                        ) : (
                            <p>No user data found. Please return to the main app.</p>
                        )}
                        <ReferralSystem userData={userData} />
                    </div>
                ) : (
                    <p className="error-message">Please join the bot to see your data.</p>
                )
            )}
        </div>
    );
};

export default App;
