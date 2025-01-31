import React from "react";
import "./MainButton.css";

function MainButton({ text, onClick }) {
  return (
    <button className="main-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default MainButton;
