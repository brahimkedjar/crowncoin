import React from 'react';
import { FaTools } from 'react-icons/fa';
import './MaintenancePage.css'; // Importing the CSS file for styling

const MaintenancePage = () => {
    return (
        <div className="maintenance-container">
            <div className="overlay">
                <div className="content">
                    <FaTools className="icon" />
                    <h1 className="heading">Under Maintenance</h1>
                    <p className="paragraph">
                        We're currently making improvements to our app. Thank you for your patience!
                    </p>
                    <p className="subtext">We'll be back online shortly.</p>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
