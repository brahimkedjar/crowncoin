import React from 'react';
import './BottomNav.css'; // Import CSS for styling

const BottomNav = ({ onNavigate }) => {
    return (
        <nav className="bottom-nav">
            <button onClick={() => onNavigate('home')} className="nav-button">Home</button>
            <button onClick={() => onNavigate('leaderboard')} className="nav-button">Leaderboard</button>
        </nav>
    );
};

export default BottomNav;