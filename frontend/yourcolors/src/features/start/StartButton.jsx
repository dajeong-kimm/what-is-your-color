import React from 'react';
import { Link } from 'react-router-dom';
import './Topbutton.css';

const StartButton = ({ to, label, onClick }) => {
  return (
    <Link
      to={to}
      className={`start-button`}  // isActive가 true일 때만 active 클래스 추가
      onClick={onClick}  // 버튼 클릭 시 상태 변경
    >
      {label}
    </Link>
  );
};

export default StartButton;
