// src/pages/main/MainPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import CardButton from "../../button/main-button/CardButton";
import "./MainPage.css";
import useStore from '../../store/UseStore'; // Zustand 상태관리

// 이미지 예시 import (원하는 경로/이미지로 교체)
import img1 from "../../images/personal_colors.jpg";
import img2 from "../../images/ai_makeup.png";
import img3 from "../../images/seasons_photo.jpg";
import img4 from "../../images/color_find.jpg"

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
          <CardButton
            title="퍼스널컬러 진단"
            icon="🔍"
            description="당신의 퍼스널컬러를 찾아보세요!"
            onClick={() => navigate("/choice")}
            bgImage={img1}
          />
            <CardButton
              title="화장품컬러 찾기"
              icon="🎨"
              description="화장품의 퍼스널컬러를 찾아보세요! "
              onClick={() => navigate("/cosmeticdiag")}
              bgImage={img4}
            />
          <CardButton
            title="AI 메이크업"
            icon="🪞"
            description="AI가 제안하는 메이크업을 체험해보세요!"
            onClick={() => navigate("/makeup")}
            bgImage={img2}
          />
          <CardButton
            title="계절네컷 촬영"
            icon="📸"
            description="계절프레임을 선택해 사진을 찍어보세요!"
            onClick={handleOpenModal}
            bgImage={img3}
          />
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
