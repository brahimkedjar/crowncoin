import React from 'react';
import './BottomNav.css'; // Import CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrophy } from '@fortawesome/free-solid-svg-icons';

const BottomNav = ({ onNavigate }) => {
    return (
        <nav className="bottom-nav">
            <button onClick={() => onNavigate('home')} className="nav-button">
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                Home
            </button>
            <div className="separator"></div>
            <button onClick={() => onNavigate('leaderboard')} className="nav-button">
                <FontAwesomeIcon icon={faTrophy} className="nav-icon" />
                Leaderboard
            </button>
        </nav>
    );
};

export default BottomNav;
