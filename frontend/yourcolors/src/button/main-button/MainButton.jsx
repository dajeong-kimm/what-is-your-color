import React from "react";
import "./MainButton.css";

const MainButton = ({ text, icon, onClick }) => {
  return (
    <button className="main-button" onClick={onClick}>
      <span className="button-icon">{icon}</span>
      <span className="button-text" dangerouslySetInnerHTML={{ __html: text }} />
    </button>
  );
};

export default MainButton;
