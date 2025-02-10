import React from 'react';
import './RightButton.css';  // 별도의 CSS 파일로 스타일 관리 (혹은 기존 CSS 파일 사용 가능)

const RightButton = ({ onRightClick }) => {
  return (
    <button 
      className="nav-button right-button" 
      onClick={onRightClick}
    >
      <span className="nav-arrow">&#10095;</span>
    </button>
  );
};

export default RightButton;
