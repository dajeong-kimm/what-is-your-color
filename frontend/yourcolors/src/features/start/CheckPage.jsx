import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import YesNoButton from "../../button/yesnobutton/YesNoButton"; // YesNoButton 컴포넌트 임포트
import "./CheckPage.css";

const CheckPage = () => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    // 홈으로 이동
    navigate("/makeupbycolor");
  };

  const handleNoClick = () => {
    // 다시 홈으로 이동
    navigate("/");
  };

  return (
    <Background>
      <Largemain>
        <div className="endpage-container">
          <div className="endpage-message">
            <h1>
              AI 메이크업을  <br />
              진행하시겠습니까 ?
            </h1>
          </div>
          <div className="endpage-buttons">
            <YesNoButton 
              onYesClick={handleYesClick} 
              onNoClick={handleNoClick}
              yesLabel="예" 
              noLabel="아니오" 
            />
          </div>
        </div>
      </Largemain>
    </Background>
  );
};

export default CheckPage;
