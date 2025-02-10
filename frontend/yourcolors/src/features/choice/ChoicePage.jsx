import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useNavigate } from "react-router-dom";
import DrAi from "../../images/dr_ai.png";
import Curator from "../../images/color_curator.png";
import "../start/MainPage.css";
import "./ChoicePage.css";

const ChoicePage = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="choice-container">
          {/* Dr. AI 컬러 진단 버튼 */}
          <div className="choice-card blue-bg" onClick={() => navigate("/diagcapturexai")}>
            <div className="choice-ai-image-wrapper">
              <img src={DrAi} alt="Dr.AI" className="choice-image" />
            </div>
            <div className="choice-content">
              <h2 className="choice-title">Dr.AI</h2>
              <p className="choice-description">
                나는 수많은 퍼스널컬러 데이터를 학습한 AI 컬러 전문가입니다! 얼굴을 분석하여
                가장 가능성이 높은 퍼스널컬러 타입을 빠르게 찾아드릴게요.
              </p>
            </div>
            <div className="choice-footer blue-footer">머신러닝 컬러 분석</div>
          </div>

          {/* 컬러 큐레이터 추천 버튼 */}
          <div className="choice-card red-bg" onClick={() => navigate("/paperyesnopage")}>
            <div className="choice-color-image-wrapper">
              <img src={Curator} alt="컬러 큐레이터" className="choice-image" />
            </div>
            <div className="choice-content">
              <h2 className="choice-title">컬러 큐레이터</h2>
              <p className="choice-description">
                나는 직접 눈, 피부, 머리카락의 색을 추출해 최적의 컬러를 찾아주는 전문가입니다! 
                세밀한 색감 분석을 원하시는 분들에게 추천해요.
              </p>
            </div>
            <div className="choice-footer red-footer">피부톤 컬러 매칭</div>
          </div>
        </div>
      </Largemain>
    </Background>
  );
};

export default ChoicePage;
