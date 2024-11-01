import React, { useEffect, useState } from 'react';
import {
    checkUserExists,
    createUser,
    getUser,
    updateReferralCount,
    getUserCount,
    getLeaderboard,
} from './database';
import './App.css';
import BottomNav from './BottomNav';
import TaskItem from './TaskItem';

const App = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [referralLink, setReferralLink] = useState('');
    const [remainingSpots, setRemainingSpots] = useState(1000000);
    const [view, setView] = useState('home');
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const unsubscribeUserCount = getUserCount((userCount) => {
            setRemainingSpots(1000000 - userCount);
        });

        const initializeApp = async () => {
            if (!window.Telegram?.WebApp) {
                setError("Telegram Web App not initialized.");
                return;
            }
    
            const urlParams = new URLSearchParams(window.location.search);
            const initData = urlParams.get('initData');
            
            if (!initData) {
                setError("No initData found in the URL.");
                return;
            }

            try {
                const parsedData = JSON.parse(decodeURIComponent(initData));
                const { user } = parsedData;
                const userId = user.id;

                setUserData(user);
                setReferralLink(`https://t.me/CROWNCOINOFFICIAL_bot?start=${user.refferal}`);

                if (parsedData.referralCode) await updateReferralCount(parsedData.referralCode, userId);

                const unsubscribeUser = getUser(userId, setUserData);
                return () => {
                    unsubscribeUser();
                    unsubscribeUserCount();
                };
            } catch (error) {
                setError("Error initializing the app.");
            }
        };

        initializeApp();
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (view === 'leaderboard' && leaderboardData.length === 0) {
                const leaderboard = await getLeaderboard();
                setLeaderboardData(leaderboard);
            }
        };
        fetchLeaderboard();
    }, [view]);

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    const handleNavigate = (newView) => {
        setView(newView);
    };

    return (
        <div className="app-container">
            {view === 'home' ? (
                <>
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
                                            {[
                                                { url: "https://t.me/crowncointon", text: "🚀 Join Our Telegram Group" },
                                                { url: "https://www.instagram.com/crowncoin_by_ton?igsh=OHFvbDk2a3N5cW03", text: "👍 Like Our Instagram Page" },
                                                { url: "https://t.me/PAWSOG_bot/PAWS?startapp=BmhA7FaN", text: "🐾🐾 Join Paws Our New Partner" },
                                                { url: "https://t.me/PinEye_Bot/pineye?startapp=r_6754210573", text: "👀👀 Join PinEye Our New Partner" },
                                            ].map((task, index) => (
                                                <li key={index}>
                                                    <TaskItem taskUrl={task.url} taskText={task.text} />
                                                </li>
                                            ))}
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
                </>
            ) : (
                <div className="leaderboard">
                    <h2 className="leaderboard-title">
                        <i className="fas fa-trophy"></i> Leaderboard
                    </h2>
                    <div className="prize-announcement">
                        <p>🏆 The first three persons will win a prize of <strong>$1000! 🏆</strong></p>
                    </div>
                    <div className="separator"></div>
                    {leaderboardData.length > 0 ? (
                        <>
                            <div className="leaderboard-header">
                                <span className="leaderboard-rank">Rank</span>
                                <span className="leaderboard-username">Username</span>
                                <span className="leaderboard-referrals">Referrals</span>
                            </div>
                            <ul className="leaderboard-list">
                                {leaderboardData.map((user, index) => (
                                    <li key={user.id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
                                        <span className="leaderboard-rank" style={{ color: 'black' }}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}.
                                        </span>
                                        <span className="leaderboard-username">{user.username}</span>
                                        <span className="leaderboard-referrals">{user.referralCount}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div className="no-data-message">No leaderboard data available.</div>
                    )}
                </div>
            )}
            <BottomNav onNavigate={handleNavigate} />
        </div>
    );
};

export default App;
