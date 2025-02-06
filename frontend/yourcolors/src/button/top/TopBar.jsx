// components/Topbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Topbar.css';
import Topbutton from './TopButton';
import Logo from "../../assets/Logo.png"; // 이미지 import

const Topbar = () => {

const [activeButton, setActiveButton] = useState(null)


// 버튼 정보 배열
const buttons = [
  { to: '/personalcolors', label: '퍼스널컬러란?', name: 'personalcolor' },
  { to: '/diagcapture', label: '퍼스널컬러 진단', name: 'diagnosis' },
  { to: '/makeup', label: 'AI 메이크업 합성', name: 'makeup' },
];

const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="Topbar">
      <div className="Topbar-container">
        <Link to="/">
          <img src={Logo} alt="로고" className="logo-img" />
        </Link>
        {/* <h1 className="Topbar-logo">너의 색깔은?</h1> */}
        <div className="Topbar-buttons">
        {buttons.map((button) => (
            <Topbutton
              key={button.name}
              to={button.to}
              label={button.label}
              isActive={activeButton === button.name}
              onClick={() => handleButtonClick(button.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
