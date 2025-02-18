import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import Color from "../../images/personal.png";
import "./PersonalDefine.css";  // 수정된 CSS 적용

const PersonalDefine = () => {
  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="content-container">
          <h1 className="personal-define-h1">퍼스널 컬러란?</h1>
          <p className="description">
            개인의 피부톤, 눈동자 색, 머리카락 색과 조화를 이루는 최적의 색상을 의미합니다. <br />
            사람마다 피부의 <strong>명도(밝고 어두움)</strong>와 <strong>채도(선명함과 탁함)</strong>, 그리고 피부의 기본 <strong>색조(웜톤/쿨톤)</strong>가 다르기 때문에, 자신에게 잘 어울리는 색상이 존재합니다.<br />
            자신에게 어울리는 컬러를 찾으면 더욱 생기 있고 조화로운 이미지를 연출할 수 있습니다.
          </p>
          <div className="image-container">
            <img src={Color} alt="color" className="image" />
          </div>
        </div>
      </Largemain>
    </Background>
  );
};

export default PersonalDefine;
