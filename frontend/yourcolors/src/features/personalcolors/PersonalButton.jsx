import React from "react";
import { Link } from "react-router-dom";
import "./PersonalButton.css"; // CSS 불러오기

const PersonalButton = ({ to, label, colorClass }) => {
  return (
    <Link to={to} className={`personal-button ${colorClass}`}>
      {label}
    </Link>
  );
};

export default PersonalButton;
