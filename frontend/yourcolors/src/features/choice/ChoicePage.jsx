import React from "react";
import Background from "../../background/background/BackGround";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import ChoiceButton from "../../button/choicebutton/ChoiceButton";
import { useNavigate } from "react-router-dom";
import "../start/Mainpage.css";

const ChoicePage = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="choice-container">
          {/* <div className="choice-column"> */}
            <div className="choice-left">
              <ChoiceButton
                imageSrc="/images/drai.png"
                description1="나는 수많은 퍼스널컬러 데이터를 학습한 AI 컬러 전문가입니다! 얼굴을 분석하여 가장 가능성이 높은 퍼스널컬러 타입을 빠르게 찾아드릴게요."
                description2="데이터 기반 분석을 선호하는 분들에게 추천해요!"
                buttonText="Dr. AI 컬러의 진단 받기"
                onClick={() => navigate("/diagcapture")}
              />
            </div>
            <div className="choice-right">
              <ChoiceButton
                imageSrc="/images/colorcurator.png"
                description1="나는 직접 눈, 피부, 머리카락의 색을 추출해 최적의 컬러를 찾아주는 전문가입니다! 각 색상의 거리 차이를 계산해, 당신과 가장 가까운 컬러를 추천해드릴게요."
                description2="세밀한 색감 분석을 원하시는 분들에게 추천해요!"
                buttonText="컬러 큐레이터의 추천 받기"
                onClick={() => navigate("/colorcurator")}
              />
            </div>
          {/* </div> */}
        </div>
      </Largemain>
    </Background>
  );
};

export default ChoicePage;