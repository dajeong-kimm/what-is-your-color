import React from "react";
import { useNavigate } from "react-router-dom";
import "./BottomBarPersonal.css"; // 새 CSS 파일 사용

const BottomBarPersonal = () => {
  
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/personalcolors");
  };

  return (
    <div className="bottom-bar-personal">
      <div className="bottom-bar-inner">
        <button onClick={handleGoBack} className="back-button">
        <i class="fa-solid fa-arrow-left fa-besat-fade fa-lg"></i>        
        </button>
      </div>
    </div>
  );
};

export default BottomBarPersonal;
