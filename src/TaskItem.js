import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './TaskItem.css';

const TaskItem = ({ taskUrl, taskText }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleClick = () => {
        if (!isLoading && !isCompleted) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setIsCompleted(true);
            }, 6000); // 5-second delay
        } else if (isCompleted) {
            setIsCompleted(false); // Reset to allow re-clicking
        }
    };

    return (
        <button 
            className={`task-button ${isCompleted ? 'completed' : ''}`} 
            onClick={handleClick}
        >
            <a 
                href={taskUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="task-link"
            >
                {isLoading ? (
                    <div className="loading-spinner"></div>
                ) : isCompleted ? (
                    <FaCheckCircle className="done-icon" />
                ) : (
                    <span>{taskText}</span>
                )}
            </a>
        </button>
    );
};

export default TaskItem;
