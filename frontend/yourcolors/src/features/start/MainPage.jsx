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
  const { fetchPersonalColors, fetchCosmetics } = useStore(); // Zustand 상태관리

  useEffect(() => {
    fetchPersonalColors(); // 컴포넌트가 렌더링될 때 데이터 fetch
    fetchCosmetics(1); // 임시로 봄(1번) 넣어둠
  }, [fetchPersonalColors, fetchCosmetics]);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // "계절네컷 촬영 📸" 버튼 클릭 시 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // "예" 버튼 클릭 시 /makeup 페이지로 이동
  const handleYes = () => {
    navigate("/makeup");
  };

  // "아니오" 버튼 클릭 시 모달 닫기
  const handleNo = () => {
    navigate("/photoqrchoice");
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="main-button-container">
          <MainButton text="퍼스널컬러 진단 🔍 " onClick={() => navigate("/choice")} />
          <MainButton text="AI 메이크업 🎨" onClick={() => navigate("/makeup")} />
          <MainButton text="계절네컷 촬영 📸" onClick={handleOpenModal} />
        </div>
      </Largemain>

      {/* 모달 - isModalOpen이 true일 때만 렌더링 */}
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
