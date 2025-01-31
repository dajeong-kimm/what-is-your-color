import React from 'react';
import './YesNoButton.css';

const YesNoButton = ({ onYesClick, onNoClick }) => {
  return (
    <div className="answer-buttons-container">
      <button 
        className="answer-button"
        onClick={onYesClick}
      >
        예
      </button>
      <button 
        className="answer-button"
        onClick={onNoClick}
      >
        아니오
      </button>
    </div>
  );
};

export default YesNoButton;
