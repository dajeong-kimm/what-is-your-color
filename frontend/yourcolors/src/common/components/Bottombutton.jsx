// components/Bottombutton.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Bottombutton.css';

const Bottombutton = ({ to, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={`bottom-button ${isActive ? 'active' : ''}`}  // isActive가 true일 때만 active 클래스 추가
      onClick={onClick}  // 버튼 클릭 시 상태 변경
    >
      {label}
    </Link>
  );
};

export default Bottombutton;
