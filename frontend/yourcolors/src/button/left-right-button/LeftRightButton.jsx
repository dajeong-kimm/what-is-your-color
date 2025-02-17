import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LeftRightButton.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
    navigate('/makeup'); // 페이지 이동
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="navigation-buttons">
      {/* currentStep이 0일 때도 공간을 유지하도록 visibility: hidden 적용 */}
      <button 
        className="nav-button"
        onClick={onLeftClick}
        style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
      >
        <FaArrowLeft className="nav-arrow" />
      </button>
      
      <button 
        className="nav-button"
        onClick={handleRightClick}
      >
         <FaArrowRight className="nav-arrow" />
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>AI 메이크업으로 이동하시겠습니까?</h2>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={handleModalConfirm}>
                예
              </button>
              <button className="modal-cancel" onClick={handleModalClose}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default LeftRightButton;
