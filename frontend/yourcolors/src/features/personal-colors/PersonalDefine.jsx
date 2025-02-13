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
        <div className="image-container">
         <h1>퍼스널 컬러란?</h1>
            
            <img src={Color} alt="color" className="image" />
        </div>
        
      </Largemain>
    </Background>
  );
};

export default PersonalDefine;
