import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import MainButton from "../../button/main-button/MainButton";
import "./MainPage.css";
import useStore from '../../store/UseStore'; // Zustand 상태관리 데이터

const MainPage = () => {
  const navigate = useNavigate();
  const { fetchPersonalColors, fetchCosmetics } = useStore();

  useEffect(() => {
    fetchPersonalColors();
    fetchCosmetics(1);
  }, [fetchPersonalColors, fetchCosmetics]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleYes = () => {
    navigate("/makeup");
  };

  const handleNo = () => {
    navigate("/photoqrchoice");
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="main-button-container">
          <MainButton text="퍼스널컬러<br />진단" icon="🔍" onClick={() => navigate("/choice")} />
          <MainButton text="AI 메이크업<br />" icon="🎨" onClick={() => navigate("/makeup")} />
          <MainButton text="계절네컷<br />촬영" icon="📸" onClick={handleOpenModal} />
        </div>
      </Largemain>

      {isModalOpen && (
        <div className="mp-modal-overlay">
          <div className="mp-modal-content">
            <h2>
              AI 메이크업을 먼저 진행하시면 <br />
              더 다양한 체험이 가능합니다. <br />
            </h2>
            <mpstrong>AI 메이크업 화면으로 이동하시겠습니까?</mpstrong>
            <br />
            <div className="mp-modal-buttons">
              <button className="mp-modal-yes" onClick={handleYes}>
                예
              </button>
              <button className="mp-modal-no" onClick={handleNo}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </Background>
  );
};

export default MainPage;
