import React, { useState } from 'react';
import './DailyBonus.css';

const DailyBonus = () => {
    const [claimed, setClaimed] = useState(false);

    const claimBonus = () => {
        // Implement bonus claiming logic (e.g., update backend)
        setClaimed(true);
        alert('You have claimed your daily bonus!');
    };

    return (
        <div className="daily-bonus">
            <h2>Daily Bonus</h2>
            {claimed ? (
                <p>You have already claimed today's bonus.</p>
            ) : (
                <button className="btn" onClick={claimBonus}>Claim Daily Bonus</button>
            )}
        </div>
    );
};

export default DailyBonus;
