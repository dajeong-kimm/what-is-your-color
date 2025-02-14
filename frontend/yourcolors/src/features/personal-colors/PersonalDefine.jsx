import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import Color from "../../images/personal.png";
import "./PersonalDefine.css";  // CSS 추가

const PersonalDefine = () => {
  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="content-container">
          <h1>퍼스널 컬러란?</h1>
          <p className="description">
            퍼스널 컬러는 개인의 피부 톤, 눈동자 색, 머리카락 색 등과 조화를 이루는 색상을 의미합니다.<br/>
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
