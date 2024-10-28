// src/App.js
import React, { useEffect, useState } from 'react';

const App = () => {
    const [userData, setUserData] = useState(null);
    const [joinYear, setJoinYear] = useState('');
    const [isFormVisible, setFormVisible] = useState(false);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;

            // Get initData from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const initData = urlParams.get('initData');

            if (initData) {
                const parsedData = JSON.parse(decodeURIComponent(initData));
                const user = parsedData.user; // Extract user information
                
                setUserData(user);
                console.log('User data:', user);

                // Check local storage for join year
                const storedJoinYear = localStorage.getItem('joinYear');
                if (!storedJoinYear) {
                    setFormVisible(true); // Show form if join year is not stored
                } else {
                    console.log('Join Year from local storage:', storedJoinYear);
                }
            } else {
                console.log("No initData found in the URL.");
            }
        } else {
            console.error("Telegram Web App not initialized.");
        }
    }, []);

    const handleJoinYearSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('joinYear', joinYear);
        alert(`Join year ${joinYear} saved!`);
        setFormVisible(false);
    };

    return (
        <div>
            <h1>CrownCoin App</h1>
            {userData ? (
                <div>
                    <p>Welcome, {userData.first_name}! Your username is {userData.username}.</p>
                    {isFormVisible ? (
                        <form onSubmit={handleJoinYearSubmit}>
                            <label>
                                Year You Joined Telegram:
                                <input
                                    type="number"
                                    value={joinYear}
                                    onChange={(e) => setJoinYear(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </form>
                    ) : (
                        <p>Your join year has been recorded.</p>
                    )}
                </div>
            ) : (
                <p>Please join the bot to see your data.</p>
            )}
        </div>
    );
};

export default App;
