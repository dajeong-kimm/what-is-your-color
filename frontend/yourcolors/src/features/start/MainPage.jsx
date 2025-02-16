import React, { useEffect } from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import MainButton from "../../button/main-button/MainButton";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터

const MainPage = () => {
  const navigate = useNavigate();

  const { fetchPersonalColors, fetchCosmetics, cosmetics } = useStore(); //Zustand 상태관리
useEffect(() => {
  fetchPersonalColors(); // 컴포넌트가 렌더링될 때 데이터 fetch
  fetchCosmetics(1); //임시로 봄(1번) 넣어둠
}, [fetchPersonalColors, fetchCosmetics]);
  // console.log(cosmetics)
  

// useEffect(() => {
//   if (personalColor) {
//     fetchCosmetics(personalColor);
//   }
// }, [personalColor, fetchCosmetics]);
  

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="main-button-container">
          <MainButton text="퍼스널컬러 진단 🔍 " onClick={() => navigate("/choice")} />
          <MainButton text="AI 메이크업 🎨" onClick={() => navigate("/makeup")} />
          <MainButton text="계절네컷 촬영 📸" onClick={() => navigate("/photoqrchoice")} />
        </div>
      </Largemain>
    </Background>
  );
};

export default MainPage;