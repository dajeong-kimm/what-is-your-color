import React, { useState } from "react";
import "./ProductButton.css";

const ProductButton = ({ text, onClick, isActive}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = () => setIsClicked(true);
  const handleMouseUp = () => setIsClicked(false);
  const handleMouseLeave = () => setIsClicked(false);

  return (
    <button
      className={`product-button ${isActive ? "active" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ProductButton;
