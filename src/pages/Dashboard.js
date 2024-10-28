import React, { useState } from 'react';
import ReferralSystem from '../components/ReferralSystem';
import './Dashboard.css';

function Dashboard({ userData }) {
    const [bonus, setBonus] = useState(0);

    const claimBonus = () => {
        setBonus(bonus + 10);
        alert('You have claimed 10 CrownCoin!');
        // Here you would also send a request to your backend to update the user's balance
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            {userData && (
                <div>
                    <p>Welcome, {userData.firstName}</p>
                    <p>Your current bonus: {bonus} CrownCoin</p>
                    <button className="btn" onClick={claimBonus}>
                        Claim Daily Bonus
                    </button>
                </div>
            )}
            <ReferralSystem userData={userData} />
        </div>
    );
}
export default Dashboard;
