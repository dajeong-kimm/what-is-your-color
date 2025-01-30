import React from "react";

const CommonButton = ({ text, onClick }) => {
  return (
    <button 
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CommonButton;
