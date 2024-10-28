import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks }) => {
    return (
        <div className="task-list">
            <h2>Available Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                        <button className="btn">Complete Task</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
