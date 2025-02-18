import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeftRightButton.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const LeftRightButton = ({ currentStep, onLeftClick, onRightClick }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRightClick = () => {
    if (currentStep === 3) {
      setIsModalOpen(true); // 모달 열기
    } else {
      onRightClick();
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate("/makeup"); // 페이지 이동
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 네비게이션 버튼 (오버레이 밖으로 이동) */}
      <div className="navigation-buttons">
        <button
          className="nav-button"
          onClick={onLeftClick}
          style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}
        >
          <FaArrowLeft className="nav-arrow" />
        </button>

        <button className="nav-button" onClick={handleRightClick}>
          <FaArrowRight className="nav-arrow" />
        </button>
      </div>

      {/* 모달 오버레이 (네비게이션 버튼 바깥으로 이동) */}
      {isModalOpen && (
        <div className="leftright-modal-overlay">
          <div className="leftright-modal-content">
            <h2>AI 메이크업으로 이동하시겠습니까?</h2>
            <div className="leftright-modal-buttons">
              <button className="leftright-modal-yes" onClick={handleModalConfirm}>
                예
              </button>
              <button className="leftright-modal-no" onClick={handleModalClose}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftRightButton;
