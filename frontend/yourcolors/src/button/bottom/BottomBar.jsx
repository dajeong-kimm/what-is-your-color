import React, { useState } from "react";
import "./BottomBar.css";
import Bottombutton from "./Bottombutton";
import CloseButton from "../closebutton/CloseButton"; // 종료하기 버튼

const Bottombar = () => {
  const [activeButton, setActiveButton] = useState(null);

  // 버튼 정보 배열
  const buttons = [
    { to: "/diagnosis", label: "진단결과", name: "diagnosis" },
    { to: "/color-details", label: "컬러상세", name: "colorDetails" },
    { to: "/best-worst", label: "BEST/WORST", name: "bestWorst" },
    { to: "/cosmetic-recommend", label: "화장품추천", name: "cosmeticRecommend" },
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
              className={button.name}
            />
          ))}
          {/* CloseButton을 감싸는 래퍼 추가 */}
          <div className="close-button-wrapper">
            <CloseButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
