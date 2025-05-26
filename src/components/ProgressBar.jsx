import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ current, total }) => (
  <div className="progress-container">
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
    </div>
    <span className="progress-text">
      {current} / {total}
    </span>
  </div>
);

export default ProgressBar;
