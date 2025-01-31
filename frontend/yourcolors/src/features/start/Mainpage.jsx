import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/Topbar";
import MainButton from "../../button/MainButton/MainButton";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="main-button-container">
          <MainButton text="퍼스널컬러란?" onClick={() => navigate("/pesonalcolors")} />
          <MainButton text="퍼스널컬러 진단" onClick={() => navigate("/diagnosis")} />
          <MainButton text="AI메이크업 합성" onClick={() => navigate("/AI")} />
        </div>
      </Largemain>
    </Background>
  );
};

export default MainPage;
