import React from "react";
import { useNavigate } from "react-router-dom"; 
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import YesNoButton from "../../button/yes-no-button/YesNoButton"; 
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
              A4 용지를 <strong>얼굴 옆에 두고 촬영</strong>하면, <br /><br />
              <strong>색 보정을 통해 실물과 가까운 컬러</strong>로 조정된 후 
              더욱 정확한 퍼스널 컬러 진단을 받을 수 있습니다. <br /><br />
              <span className="paper-question">A4 용지를 사용하시겠습니까?</span>
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
