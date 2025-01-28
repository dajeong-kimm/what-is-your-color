// components/Topbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Topbar.css';
import Topbutton from './Topbutton'; 

const Topbar = () => {

const [activeButton, setActiveButton] = useState(null)

const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="Topbar">
      <div className="Topbar-container">
        <h1 className="Topbar-logo">너의 색깔은?</h1>
        <div className="Topbar-buttons">
          <Topbutton
            to="/personalcolor"
            label="퍼스널컬러란?"
            isActive={activeButton === 'personalcolor'}
            onClick={() => handleButtonClick('personalcolor')}
          />
          <Topbutton
            to="/diagnosis"
            label="퍼스널컬러 진단"
            isActive={activeButton === 'diagnosis'}
            onClick={() => handleButtonClick('diagnosis')}
          />
          <Topbutton
            to="/makeup"
            label="AI 메이크업 합성"
            isActive={activeButton === 'makeup'}
            onClick={() => handleButtonClick('makeup')}
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
