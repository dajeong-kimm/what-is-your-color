import React from "react";
import Background from "../../background/background/Background";
import StartImage from "../../assets/start.png"; // 이미지 파일 불러오기
import Topbutton from "../../buttons/top/TopButton"; // 버튼 재사용
import "./Home.css";

const Home = () => {
  return (
    <Background>
       <div className="home-container">
        {/* 이미지 추가 */}
        <img src={StartImage} alt="시작 이미지" className="start-image" />
        <Topbutton to="/Mainpage" label="시작하기" />
      </div>
    </Background>
  );
};

export default Home;

