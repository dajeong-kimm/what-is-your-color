import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import YesNoButton from "../../button/yesnobutton/YesNoButton"; // YesNoButton 컴포넌트 임포트
import "./EndPage.css";

const EndPage = () => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    // 홈으로 이동
    navigate("/");
  };

  const handleNoClick = () => {
    // 다시 진단하기 페이지로 이동
    navigate("/diagcapture");
  };

  return (
    <Background>
      <Largemain>
        <div className="endpage-container">
          <div className="endpage-message">
            <h1>
              " 너의 이름은 ? " <br />
              체험이 완료되었습니다!
            </h1>
          </div>
          <div className="endpage-buttons">
            <YesNoButton 
              onYesClick={handleYesClick} 
              onNoClick={handleNoClick}
              yesLabel="홈으로" 
              noLabel="다시 진단하기" 
            />
          </div>
        </div>
      </Largemain>
    </Background>
  );
};

export default EndPage;
