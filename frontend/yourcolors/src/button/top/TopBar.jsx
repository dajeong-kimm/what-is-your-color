// components/Topbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopBar.css';
import Topbutton from './TopButton';
import Logo from "../../assets/yourcolor.png"; // 이미지 import


const Topbar = () => {
  const location = useLocation();

    
  // 현재 경로에 따라 activeButton 값을 결정합니다.
  const activeButton = (() => {
    if (location.pathname === '/personaldefine') return 'define';
    if (location.pathname === '/personalcolors') return 'personalcolor';
    if (location.pathname === '/qna') return 'qna';
    if (location.pathname === '/mainpage') return 'main';
    if (location.pathname === '/') return 'start';
    return '';
  })();

  // 버튼 정보 배열
  const buttons = [
    { to: '/personaldefine', label: '퍼스널컬러란?', name: 'define' },
    { to: '/personalcolors', label: '퍼스널컬러 종류', name: 'personalcolor' },
    { to: '/qna', label: 'QnA', name: 'qna' }, // QnA 버튼 추가
    { to: '/mainpage', label: '메인페이지', name: 'main' },
    { to: '/', label: '처음으로', name: 'start' },
  ];
  return (
    <div className="Topbar">
      <div className="Topbar-container">
        <Link to="/">
          <img src={Logo} alt="로고" className="logo-img" />
        </Link>
        <div className="Topbar-buttons">
          {buttons.map((button) => (
            <Topbutton
              key={button.name}
              to={button.to}
              label={button.label}
              isActive={activeButton === button.name} // active 상태에 따라 CSS 효과 적용
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
