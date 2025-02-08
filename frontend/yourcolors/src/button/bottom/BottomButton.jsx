import React from "react";
import { Link } from "react-router-dom";
import "./BottomButton.css";

const Bottombutton = ({ to, label, isActive, onClick, className }) => {
  return (
    <Link
      to={to}
      className={`bottom-button ${className} ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Bottombutton;
