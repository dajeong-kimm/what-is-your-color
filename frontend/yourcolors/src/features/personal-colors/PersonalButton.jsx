import React from "react";
import { Link } from "react-router-dom";
import "./PersonalButton.css"; // CSS 불러오기

const PersonalButton = ({ id, label, colorClass }) => {
  return (
    <Link to={`/personalcolors/${id}`} className={`personal-button ${colorClass}`}>
      {label}
    </Link>
  );
};

export default PersonalButton;
