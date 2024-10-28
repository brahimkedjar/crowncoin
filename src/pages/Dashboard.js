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
                </div>
            ) : (
                <p>No user data found. Please return to the main app.</p>
            )}
            <ReferralSystem userData={userData} />
        </div>
    );
}

export default Dashboard;
