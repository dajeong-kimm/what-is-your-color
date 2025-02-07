import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import MainButton from "../../button/main-button/MainButton";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="main-button-container">
          <MainButton text="퍼스널컬러란?" onClick={() => navigate("/personalcolors")} />
          <MainButton text="퍼스널컬러 진단" onClick={() => navigate("/diagcapture")} />
          <MainButton text="AI 메이크업 합성" onClick={() => navigate("/makeup")} />
        </div>
      </Largemain>
    </Background>
  );
};

export default MainPage;