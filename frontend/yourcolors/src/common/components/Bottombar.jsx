// components/Bottombar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Bottombar.css';
import Bottombutton from './Bottombutton'; 

const Bottombar = () => {

const [activeButton, setActiveButton] = useState(null)


// 버튼 정보 배열
const buttons = [
  { to: '/recommend', label: '화장품 추천 받기', name: 'recommend' },
  { to: '/makeup', label: 'AI 메이크업 합성', name: 'makeup' },
];

const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="Bottombar">
      <div className="Bottombar-container">
        <div className="Bottombar-buttons">
        {buttons.map((button) => (
            <Bottombutton
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

export default Bottombar;
