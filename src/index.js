// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MaintenancePage from './maintenance';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      /<MaintenancePage />
    </Router>
  </React.StrictMode>
);

reportWebVitals();
