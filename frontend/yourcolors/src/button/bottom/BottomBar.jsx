import React, { useState }  from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 import
import "./BottomBar.css";
import Bottombutton from "./BottomButton";
import SendButton from "../sendbutton/SendButton"; 
import CloseButton from "../closebutton/CloseButton"; // 종료하기 버튼

const Bottombar = ({ currentStep, setCurrentStep }) => {

  const navigate = useNavigate(); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 각 버튼은 모달의 인덱스와 매핑됩니다.
  const buttons = [
    { index: 0, label: "진단 결과", name: "diagnosis" },
    { index: 1, label: "BEST/WORST", name: "bestWorst" },
    { index: 2, label: "화장품 추천", name: "cosmeticRecommend" },
    { index: 3, label: "컬러 컨설팅", name: "colorcunsulting" },
    { index: 4, label: "AI 메이크업", name: "makeup"},
  ];

  const handleButtonClick = (index) => {
    if (index === 4) {
      setIsModalOpen(true); // AI 메이크업 버튼 클릭 시 모달 열기
    } else {
      setCurrentStep(index);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate('/makeup'); // AI 메이크업 페이지로 이동
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
          <SendButton />
          <CloseButton />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>AI 메이크업으로 이동하시겠습니까?</h2>
            <div className="modal-buttons">
              <button className="modal-yes" onClick={handleModalConfirm}>
                예
              </button>
              <button className="modal-no" onClick={handleModalClose}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Bottombar;
