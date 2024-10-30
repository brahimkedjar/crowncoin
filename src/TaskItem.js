import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import './TaskItem.css';

const TaskItem = ({ label, link }) => {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleTaskClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setCompleted(true);
        }, 5000); // 5 seconds delay
    };

    return (
        <li className="task-item">
            <a href={link} target="_blank" rel="noopener noreferrer" className="task-link" onClick={handleTaskClick}>
                {label}
            </a>
            <span className="task-status-icon">
                {loading ? (
                    <AiOutlineLoading3Quarters className="loading-icon" />
                ) : completed ? (
                    <FaCheckCircle className="done-icon" />
                ) : null}
            </span>
        </li>
    );
};

export default TaskItem;
