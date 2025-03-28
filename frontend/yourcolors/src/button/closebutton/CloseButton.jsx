import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CloseButton.css";
import ModalPortal from "../../background/background/ModalPortal"; // ModalPortal import

const CloseButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // 종료하기 버튼 클릭 시 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 예 버튼 클릭: 메인("/")으로 이동
  const handleYes = () => {
    navigate("/");
  };

  // 아니오 버튼 클릭: 모달만 닫기
  const handleNo = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="close-button-container">
      {/* 종료하기 버튼 */}
      <button className="close-button" onClick={handleOpenModal}>
        종료하기
      </button>

      {/* 모달 (isModalOpen이 true일 때만 보여줌) */}
      {isModalOpen && (
        <ModalPortal>
          <div className="close-modal-overlay">
            <div className="close-modal-content">
              <h2>
                “너의 색깔은 ?” <br />
                체험을 종료하시겠습니까?
              </h2>
              <div className="close-modal-buttons">
                <button className="close-modal-yes" onClick={handleYes}>
                  예
                </button>
                <button className="close-modal-no" onClick={handleNo}>
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

export default CloseButton;
