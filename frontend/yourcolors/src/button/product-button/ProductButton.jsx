import React from "react";
import "./ProductButton.css";

const ProductButton = ({ text, onClick, className = "", style = {}, active = false }) => {
  return (
    <button className={`product-button ${active ? "active" : ""} ${className}`} style={style} onClick={onClick}>
      {text}
    </button>
  );
};

export default ProductButton;
