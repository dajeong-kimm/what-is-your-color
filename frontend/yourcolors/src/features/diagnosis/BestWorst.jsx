import React, { useEffect } from 'react';
import Background from "../../background/background/Background";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import "./BestWorst.css"; // 스타일 import
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터
import { useNavigate } from "react-router-dom";
import LeftRightButton from "../../button/left-right-button/LeftRightButton"; // 🔹 추가


const BestWorst = () => {
  const navigate = useNavigate(); // 🔹 네비게이션 훅 추가

    // Zustand 상태에서 personalColorDetails 가져오기
  const { personalColorDetails } = useStore();
  console.log("bestworst 페이지 ", personalColorDetails);

<<<<<<< HEAD
=======
  // 🔹 임시 예시 데이터 (여기에 GPT의견 이랑 베스트워스트 컬러 색상 불러오는 것임~!!!!!!!!!!!)
  const exampleData = {
    consulting: `봄 웜 라이트 톤에는 금빛 악세서리와 밝은 파스텔 색상의 악세서리가 잘 어울립니다. 
                  안경은 부드러운 골드 프레임, 목걸이는 얇은 금속 체인, 귀걸이는 작은 진주나 크리스탈이 좋습니다. 
                  향수는 상큼한 시트러스 계열이 어울리고, 의상은 따뜻한 톤의 베이지, 연한 핑크, 민트 컬러를 추천합니다. 
                  여름 쿨 뮤트와 겨울 쿨 뮤트 톤의 서브 컬러에 맞는 차가운 실버 악세서리나 블루, 퍼플, 그린 색상도 적합할 것입니다.`,
    bestcolor: ["#FFD3AD", "#B3FFBF", "#E1CCFF", "#FFFD00", "#FFB6C1"],
    worstcolor: ["#4B4B4B", "#2F2F2F", "#1C1C1C", "#000000", "#A3A3A3"],
  };

  const consulting = exampleData.consulting

  const handleLeftClick = () => {
    navigate("/personalcolors/12");
  };
  
  const handleRightClick = () => {
    navigate("/recommend");
  };
>>>>>>> origin


   return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="full-container">

          <div className="top-container">

          {/* Best Color Section */}
          <div className="container-best">
            <h1 className="title">Best Color</h1>
            <div className="color-boxes">
              {/* Best Color 목록에서 색상값을 렌더링 */}
              {exampleData.bestcolor.map((color, index) => (
                  <div key={index} className="color-box" 
                  style={{ backgroundColor: color }}></div> ))}
              </div> {/* 이거 5가지 컬러 박스니까 안에 데이터만 변경!!!!!!!!!!!!*/}

              {/* <ul>
                {personalColorDetails.bestcolor_name?.map((color, index) => (
                  <li key={index}>{color}</li>
                ))}
              </ul> */}
          </div>

            {/* Worst Color Section */}
          <div className="container-worst">
            <h1 className="title">Worst Color</h1>
            <div className="color-boxes">
              {exampleData.worstcolor.map((color, index) => (
                  <div key={index} className="color-box" 
                  style={{ backgroundColor: color }}></div> ))}
            </div>

              {/* <ul>
                {personalColorDetails.worstcolor_name?.map((color, index) => (
                  <li key={index}>{color}</li>
                ))}
              </ul> */}

            </div>
          </div>
          <div className="bottom-container">
            <div className="GPT-consulting">{consulting}</div>
          </div>
        </div>
      </SmallMain>

      {/* 🔹 화살표 네비게이션 버튼 추가 */}
      <LeftRightButton 
        onLeftClick={handleLeftClick} // 왼쪽 버튼 동작 추가 가능
        onRightClick={handleRightClick} // 오른쪽 버튼 누르면 "/bestworst"로 이동
      />


      <Bottombar />
    </Background>
  );
};

export default BestWorst;