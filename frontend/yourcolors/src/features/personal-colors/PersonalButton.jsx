import React from "react";
import { Link } from "react-router-dom";
import "./PersonalButton.css"; // CSS 불러오기

const PersonalButton = ({ id, label, colorClass }) => {
  
  const handleTouchStart = (e) => {
    e.currentTarget.classList.add("active"); // 터치 시 active 효과 추가
  };
  
  const handleTouchEnd = (e) => {
    setTimeout(() => {
      e.currentTarget.classList.remove("active"); // 터치가 끝나면 효과 제거
    }, 150); // 약간의 딜레이 추가
  };

  
  return (
    <Link to={`/personalcolors/${id}`} className={`personal-button ${colorClass}`}
    
    onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
      {label}
    </Link>

  );
};

export default PersonalButton;
