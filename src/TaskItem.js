import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './TaskItem.css';

const TaskItem = ({ taskUrl, taskText }) => {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleClick = () => {
        if (!isCompleted) {
            setIsCompleted(true);
            // You can add any additional logic here if needed, like calling an API.
            setTimeout(() => {
                setIsCompleted(true); // Sets completed state after 5 seconds
            }, 5000);
        }
    };

    return (
        <button 
            className={`task-button ${isCompleted ? 'completed' : ''}`} 
            onClick={handleClick}
            disabled={isCompleted}
        >
            <a 
                href={taskUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="task-link"
            >
                {isCompleted ? (
                    <FaCheckCircle className="done-icon" />
                ) : (
                    <span>{taskText}</span>
                )}
            </a>
        </button>
    );
};

export default TaskItem;
