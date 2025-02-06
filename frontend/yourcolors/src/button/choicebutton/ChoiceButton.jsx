import React from "react";
import "./ChoiceButton.css";

function ChoiceButton({ imageSrc, description1, description2, buttonText, onClick }) {
  return (
    <div className="choice-button" onClick={onClick}>
      <img src={imageSrc} alt="button image" className="choice-image" />
      <p className="choice-description">{description1}</p>
      <p className="choice-description">{description2}</p>
      <div className="choice-title">{buttonText}</div>
    </div>
  );
}

export default ChoiceButton;