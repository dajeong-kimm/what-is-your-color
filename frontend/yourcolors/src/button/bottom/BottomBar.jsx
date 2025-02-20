import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BottomBar.css";
import Bottombutton from "./BottomButton";
import CloseButton from "../closebutton/CloseButton";
import ModalPortal from "../../background/background/ModalPortal";  // ModalPortal import

const Bottombar = ({ currentStep, setCurrentStep }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // 모달이 뜨면 스크롤 방지
      document.body.classList.add("modal-active"); // 모달 활성화 시 class 추가
    } else {
      document.body.style.overflow = "auto"; // 모달이 닫히면 스크롤 활성화
      document.body.classList.remove("modal-active"); // 모달 비활성화 시 class 제거
    }
  }, [isModalOpen]);

  const buttons = [
    { index: 0, label: "진단 결과", name: "diagnosis" },
    { index: 1, label: "BEST/WORST", name: "bestWorst" },
    { index: 2, label: "화장품 추천", name: "cosmeticRecommend" },
    { index: 3, label: "컬러 컨설팅", name: "colorcunsulting" },
    { index: 4, label: "AI 메이크업", name: "makeup" },
  ];

  const handleButtonClick = (index) => {
    if (index === 4) {
      setIsModalOpen(true);
    } else {
      setCurrentStep(index);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate("/makeup");
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
          <CloseButton />
        </div>
      </div>

      {/* 모달을 ModalPortal을 통해 document.body에 렌더링 */}
      {isModalOpen && (
        <ModalPortal>
          <div className="bottombar-modal-overlay">
            <div className="bottombar-modal-content">
              <h2>AI 메이크업으로 이동하시겠습니까?</h2>
              <div className="bottombar-modal-buttons">
                <button
                  className="bottombar-modal-yes"
                  onClick={handleModalConfirm}
                >
                  예
                </button>
                <button
                  className="bottombar-modal-no"
                  onClick={handleModalClose}
                >
                  아니오
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default Bottombar;
