// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReferralSystem from '../components/ReferralSystem';
import { db } from '../firebase'; // Import Firebase Firestore
import { doc, getDoc } from 'firebase/firestore';
import './Dashboard.css';

function Dashboard() {
    const location = useLocation();
    const userId = location.state?.userData?.id; // Assuming you pass userId here
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch user data from Firebase Firestore
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', userId));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        console.log("No such user!");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUserData();
    }, [userId]);

    return (
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
    );
}

export default Dashboard;
