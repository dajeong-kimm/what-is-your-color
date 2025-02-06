import React from "react";
import "./YesNoButton.css";

const YesNoButton = ({ onYesClick, onNoClick, yesLabel = "예", noLabel = "아니오" }) => {
  return (
    <div className="answer-buttons-container">
      <button 
        className="answer-button"
        onClick={onYesClick}
      >
        {yesLabel}
      </button>
      <button 
        className="answer-button"
        onClick={onNoClick}
      >
        {noLabel}
      </button>
    </div>
  );
};

export default YesNoButton;
