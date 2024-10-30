// Leaderboard.js
import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ users }) => {
    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-title">Leaderboard</h2>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Referrals</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className={`leaderboard-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.referralCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
