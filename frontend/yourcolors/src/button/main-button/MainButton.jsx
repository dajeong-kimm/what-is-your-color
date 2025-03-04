import React from "react";
import "./MainButton.css";

const MainButton = ({ text, icon, onClick, bgImage }) => {
  const buttonStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  return (
    <button className="main-button" style={buttonStyle} onClick={onClick}>
      <span className="button-icon">{icon}</span>
      <span className="button-text" dangerouslySetInnerHTML={{ __html: text }} />
    </button>
  );
};

export default MainButton;
