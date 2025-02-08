import React from "react";
import Background from "../../background/background/Background";
import StartImage from "../../assets/Start.png"; // 이미지 파일 불러오기
import Topbutton from "../../button/top/TopButton"; // 버튼 재사용
import "./Home.css";

const Home = () => {
  return (
    <Background>
      <div className="home-container">
        {/* 이미지 추가 */}
        <img src={StartImage} alt="시작 이미지" className="start-image" />
        
        {/* 시작하기 버튼 (이미지 아래 배치) */}
        <div className="home-button">
          <Topbutton to="/Mainpage" label="시작하기" />
        </div>
      </div>
    </Background>
  );
};

export default Home;
