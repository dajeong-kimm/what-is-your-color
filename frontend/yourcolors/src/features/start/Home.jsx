import React, { useEffect } from "react";
import Background from "../../background/background/Background";
import StartImage from "../../assets/Start.png"; // 이미지 파일 불러오기
import StartButton from "./StartButton";
import "./Home.css";
import useWebcamStore from "../../store/useWebcamStore"; // Zustand 불러오기

const Home = () => {
  const { startCamera, isCameraOn } = useWebcamStore();

  useEffect(() => {
    if (!isCameraOn) {
      startCamera(); // 홈 화면에서 웹캠 시작
    }
  }, [isCameraOn, startCamera]);


  return (
    <Background>
      <div className="home-container">
        {/* 이미지 추가 */}
        <img src={StartImage} alt="시작 이미지" className="start-image" />
        
        {/* 시작하기 버튼 (이미지 아래 배치) */}
        <div className="home-button">
          <StartButton to="/Mainpage" label="시작하기" />
        </div>
      </div>
    </Background>
  );
};

export default Home;
