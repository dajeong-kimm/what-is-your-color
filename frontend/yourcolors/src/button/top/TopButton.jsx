// components/TopButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import './TopButton.css';

const Topbutton = ({ to, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={`top-button ${isActive ? 'active' : ''}`}  // isActive가 true일 때 active 클래스 추가
      onClick={onClick}  // (onClick 필요 시 사용, 여기선 useLocation으로 제어)
    >
      {label}
    </Link>
  );
};

export default Topbutton;
