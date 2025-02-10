import React from "react";
import "./LeftButton.css";

const LeftButton = ({ onClick }) => {
  return (
    <button className="nav-button left-button" onClick={onClick}>
      <span className="nav-arrow">&#10094;</span>
    </button>
  );
};

export default LeftButton;
