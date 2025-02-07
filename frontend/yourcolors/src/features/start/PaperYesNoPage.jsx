import React from "react";
import { useNavigate } from "react-router-dom"; 
import Background from "../../background/background/BackGround";
import Largemain from "../../background/background/LargeMain";
import YesNoButton from "../../button/yesnobutton/YesNoButton"; 
import "./PaperYesNoPage.css"; // 이미 임포트된 CSS

const EndPage = () => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    navigate("/diagcapture");
  };

  const handleNoClick = () => {
    navigate("/diagcapturex");
  };

  return (
    <Background>
      <Largemain>
        <div className="paper-container">
          <div className="paper-message">
            {/* 일부 내용은 그대로 유지하고, 질문 문구만 <span> 으로 감싸기 */}
            <h1>
              흰색 종이가 있다면 색상 보정을 위해 체험에 사용할 수 있습니다. <br /><br />
              <span className="paper-question">종이를 사용하시겠습니까?</span>
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

export default EndPage;
