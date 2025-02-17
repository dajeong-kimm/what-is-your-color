import React from "react";
import "./BottomBar.css";
import Bottombutton from "./BottomButton";
import SendButton from "../sendbutton/SendButton"; 
import CloseButton from "../closebutton/CloseButton"; // 종료하기 버튼

const Bottombar = ({ currentStep, setCurrentStep }) => {
  // 각 버튼은 모달의 인덱스와 매핑됩니다.
  const buttons = [
    { index: 0, label: "진단 결과", name: "diagnosis" },
    { index: 1, label: "BEST/WORST", name: "bestWorst" },
    { index: 2, label: "화장품 추천", name: "cosmeticRecommend" },
    { index: 3, label: "컬러 컨설팅", name: "colorcunsulting" },
  ];

  const handleButtonClick = (index) => {
    setCurrentStep(index);
  };

  return (
    <div className="Bottombar">
      <div className="Bottombar-container">
        <div className="Bottombar-buttons">
          {buttons.map((button) => (
            <Bottombutton
              key={button.name}
              label={button.label}
              isActive={currentStep === button.index}
              onClick={() => handleButtonClick(button.index)}
              className={button.name}
            />
          ))}
          {/* <SendButton /> */}
          <CloseButton />
        </div>
      </div>
    </div>
  );
};

export default Bottombar;
