import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useNavigate } from "react-router-dom";
import DrAi from "../../images/dr_ai.png";
import Curator from "../../images/color_curator.png";
// import "../start/MainPage.css";
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
              {/* <p className="choice-name">저는<br /> <strong>머신러닝</strong><br />에 특화된 모델이에요!</p> */}
            </div>
            <div className="choice-content">
              <h2 className="choice-title">Dr.AI</h2>
              <p className="choice-description">
                나는 <strong>수많은 퍼스널컬러 데이터를 학습</strong>한 <br />AI 컬러 전문가입니다! <br />
                <strong>형광등, 자연광 등 다양한 환경</strong>에서의
                <br />얼굴을 분석하고, <strong>가장 가능성이 높은<br />퍼스널컬러 타입</strong>을
                빠르게 찾아드릴게요.
              </p>
            </div>
            <div className="choice-footer blue-footer">머신러닝 컬러 분석</div>
          </div>

          {/* 컬러 큐레이터 추천 버튼 */}
          <div className="choice-card red-bg" onClick={() => navigate("/diagcapturex")}>
            <div className="choice-color-image-wrapper">
              <img src={Curator} alt="컬러 큐레이터" className="choice-image" />
            </div>
            <div className="choice-content">
              <h2 className="choice-title">컬러 큐레이터</h2>
              <p className="choice-description">
                나는 직접 <strong>눈, 피부, 머리카락의 색</strong>을 추출해 <br />
                <strong>최적의 컬러</strong>를 찾아주는 전문가입니다! <br />
                세밀한 색감 분석을 원하시는 분들에게 추천해요.
                <strong><br />색 보정을 통해 실물과 가까운 컬러</strong>로 <br />
                더욱 정확한 진단을 받을 수 있습니다.
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
