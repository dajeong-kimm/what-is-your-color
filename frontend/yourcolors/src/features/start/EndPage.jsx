import React from "react";
import Background from "../../background/background/Background";
import Topbutton from "../../button/top/TopButton";
import "./EndPage.css";

const EndPage = () => {
  return (
    <Background>
      <div className="endpage-container">
        <div className="endpage-message">
          <h1>너의 이름은 ? 체험이 완료되었습니다!</h1>
        </div>
        <div className="endpage-buttons">
          <Topbutton to="/Home" label="홈으로" />
          <Topbutton to="/Diagnosis" label="다시 진단하기" />
        </div>
      </div>
    </Background>
  );
};

export default EndPage;
