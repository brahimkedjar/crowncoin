// src/pages/ReferralSystem.js
import React, { useState } from 'react';
import './ReferralSystem.css';

function ReferralSystem({ userData }) {
    const [referralCode, setReferralCode] = useState('');

    const generateReferralCode = () => {
        const code = userData ? `${userData.username}-${userData.id}` : '';
        setReferralCode(code);
    };

    return (
        <div className="referral-system">
            <h3>Invite Friends and Earn Rewards</h3>
            <button className="btn" onClick={generateReferralCode}>
                Generate Referral Code
            </button>
            {referralCode && (
                <p>
                    Your referral code: <strong>{referralCode}</strong>
                </p>
            )}
        </div>
    );
}

export default ReferralSystem;
