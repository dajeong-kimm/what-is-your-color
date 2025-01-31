import React from 'react';
import { Link } from 'react-router-dom';
import './BottomButton.css';

const Bottombutton = ({ to, label, isActive, onClick, className }) => {
  return (
    <Link
      to={to}
      className={`bottom-button ${className} ${isActive ? 'active' : ''}`} // 버튼마다 개별 클래스 추가
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Bottombutton;
