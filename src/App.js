// src/App.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Ensure your styles are modern and appealing

const App = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const urlParams = new URLSearchParams(window.location.search);
            const initData = urlParams.get('initData');

            if (initData) {
                const parsedData = JSON.parse(decodeURIComponent(initData));
                const user = parsedData.user;

                setUserData(user);
                console.log('User data:', user);
                // Simulating a delay for loading effect
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
                    <div className="user-welcome">
                        <p>Welcome, <strong>{userData.first_name}!</strong></p>
                    </div>
                ) : (
                    <p className="error-message">Please join the bot to see your data.</p>
                )
            )}
        </div>
    );
};

export default App;
