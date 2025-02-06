import React from "react";
import Background from "../../background/background/BackGround";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import "./BestWorst.css"; // 스타일 import

const BestWorst = () => {

    // 🔹 임시 예시 데이터
    const exampleData = {
      consulting:`봄 웜 라이트 톤에는 금빛 악세서리와 밝은 파스텔 색상의 악세서리가 잘 어울립니다. 
                    안경은 부드러운 골드 프레임, 목걸이는 얇은 금속 체인, 귀걸이는 작은 진주나 크리스탈이 좋습니다. 
                    향수는 상큼한 시트러스 계열이 어울리고, 의상은 따뜻한 톤의 베이지, 연한 핑크, 민트 컬러를 추천합니다. 
                    여름 쿨 뮤트와 겨울 쿨 뮤트 톤의 서브 컬러에 맞는 차가운 실버 악세서리나 블루, 퍼플, 그린 색상도 적합할 것입니다.`,
      bestcolor:["#FFD3AD", "#B3FFBF", "#E1CCFF", "#FFFD.D0", "#FFB6C1" ],
      worstcolor:["#4B4B4B", "#2F2F2F", "#1C1C1C", "#000000", "#A3A3A3"],

    };

    const consulting = exampleData.consulting

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
                {exampleData.bestcolor.map((color, index) => (
                  <div key={index} className="color-box" 
                  style={{ backgroundColor: color }}></div> ))}
              </div>
            </div>

            {/* Worst Color Section */}
            <div className="container-worst">
              <h1 className="title">Worst Color</h1>
              <div className="color-boxes">
                {exampleData.worstcolor.map((color, index) => (
                  <div key={index} className="color-box" 
                  style={{ backgroundColor: color }}></div> ))}
              </div>
            </div>  
          </div>
          
          <div className="bottom-container">
            <div className="GPT-consulting">{consulting}</div>
          </div>
        </div>
      </SmallMain>
      <Bottombar />
    </Background>
  );
};

export default BestWorst;
