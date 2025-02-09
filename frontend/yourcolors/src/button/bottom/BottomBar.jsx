import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./BottomBar.css";
import Bottombutton from "./Bottombutton";
import CloseButton from "../closebutton/CloseButton"; // 종료하기 버튼

const Bottombar = () => {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("");

  // 버튼 정보 배열 (첫 번째 버튼의 to 값을 "/diagresult"로 변경)
  const buttons = [
    { to: "/diagresult", label: "진단결과", name: "diagnosis" },
    { to: "/personalcolors/:id", label: "컬러상세", name: "colorDetails" },
    { to: "/bestworst", label: "BEST/WORST", name: "bestWorst" },
    { to: "/recommend", label: "화장품추천", name: "cosmeticRecommend" },
  ];

  // 현재 경로에 따라 activeButton 설정
  useEffect(() => {
    const currentPath = location.pathname;
    const active = buttons.find((button) => button.to === currentPath);
    if (active) {
      setActiveButton(active.name);
    } else {
      // 만약 현재 경로가 버튼에 해당하지 않는다면 기본값(예: 첫 버튼) 설정 가능
      setActiveButton(buttons[0].name);
    }
  }, [location.pathname, buttons]);

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
          <CloseButton />
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
