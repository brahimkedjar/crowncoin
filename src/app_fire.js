import React, { useEffect, useState } from 'react';
import {
    checkUserExists,
    createUser,
    getUser,
    updateReferralCount,
    getUserCount,
    getLeaderboard,
} from './database_supa';
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
        // Fetch user count and update remaining spots
        const fetchUserCount = async () => {
            try {
                const userCount = await getUserCount(); // Assumes getUserCount returns a promise
                setRemainingSpots(1000000 - userCount);
            } catch (err) {
                console.error('Error fetching user count:', err);
                setError('Failed to fetch user count.');
            }
        };
        fetchUserCount();
    }, []); 

    useEffect(() => {
        const initializeApp = async () => {
            if (!window.Telegram || !window.Telegram.WebApp) {
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
                const userId = parsedData.user.id;
                setUserData(parsedData.user);
    
                const botUsername = 'CROWNCOINOFFICIAL_bot';
                setReferralLink(`https://t.me/${botUsername}?start=${parsedData.user.refferal}`);
    
                if (parsedData.referralCode) {
                    await updateReferralCount(parsedData.referralCode, userId);
                }
    
                const user = await getUser(userId); // Assumes getUser is a promise
                setUserData(user);
            } catch (err) {
                console.error('Error initializing the app:', err);
                setError("Error initializing the app.");
            }
        };
        initializeApp();
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (view === 'leaderboard' && leaderboardData.length === 0) {
                try {
                    const leaderboard = await getLeaderboard();
                    setLeaderboardData(leaderboard);
                } catch (err) {
                    console.error('Error fetching leaderboard:', err);
                    setError("Failed to fetch leaderboard data.");
                }
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
                                            <li><TaskItem taskUrl="https://t.me/crowncointon" taskText="🚀 Join Our Telegram Group" /></li>
                                            <li><TaskItem taskUrl="https://www.instagram.com/crowncoin_by_ton?igsh=OHFvbDk2a3N5cW03" taskText="👍 Like Our Instagram Page" /></li>
                                            <li><TaskItem taskUrl="https://t.me/PAWSOG_bot/PAWS?startapp=BmhA7FaN" taskText="🐾🐾 Join Paws Our New Partner" /></li>
                                            <li><TaskItem taskUrl="https://t.me/PinEye_Bot/pineye?startapp=r_6754210573" taskText="👀👀 Join PinEye Our New Partner" /></li>
                                        </ul>
                                    </div>
                                    <div className="referral-section modern-section">
                                        <h3>Your Referral Link</h3>
                                        <p>Share this link to refer others:</p>
                                        <input type="text" value={referralLink} readOnly className="referral-input" />
                                        <button onClick={handleCopyReferralLink} className="copy-referral-button">Copy Referral Link</button>
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
                    <h2 className="leaderboard-title"><i className="fas fa-trophy"></i> Leaderboard</h2>
                    <div className="prize-announcement"><p>🏆 The first three persons will win a prize of <strong>$1000! 🏆</strong></p></div>
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
                                    <li key={index} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
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
