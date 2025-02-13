import React from "react";
import "./BottomButton.css";

const Bottombutton = ({ label, isActive, onClick, className }) => {
  return (
    <button
      className={`bottom-button ${className} ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Bottombutton;
