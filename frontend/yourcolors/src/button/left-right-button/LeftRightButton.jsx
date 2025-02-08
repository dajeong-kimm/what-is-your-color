import React from 'react';
import './LeftRightButton.css';

const LeftRightButton = ({ onLeftClick, onRightClick }) => {
  return (
    <div className="navigation-buttons">
      <button 
        className="nav-button"
        onClick={onLeftClick}
      >
        <span className="nav-arrow">&#10094;</span>
      </button>
      <button 
        className="nav-button"
        onClick={onRightClick}
      >
        <span className="nav-arrow">&#10095;</span>
      </button>
    </div>
  );
};

export default LeftRightButton;
