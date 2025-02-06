import React, { useEffect } from 'react';
import Background from "../../background/background/BackGround";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import bestImage from "./여름뮤트베스트컬러.jpg"; // 이미지 import
import worstImage from "./여름뮤트워스트컬러.jpg"; // 이미지 import
import "./BestWorst.css"; // 스타일 import
import useStore from '../../store/useStore'; //Zustand 상태관리 데이터터


const BestWorst = () => {
    // Zustand 상태에서 personalColorDetails 가져오기
  const { personalColorDetails } = useStore();
  console.log("bestworst 페이지 ", personalColorDetails);

   return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="full-container">
          {/* Best Color Section */}
          <div className="container-best">
            <h1 className="title">Best Color</h1>
            <div className="best-image">
              {/* Best Color 목록에서 색상값을 렌더링 */}
              <ul>
                {personalColorDetails.bestcolor_name?.map((color, index) => (
                  <li key={index}>{color}</li>
                ))}
              </ul>
              <img src={bestImage} alt="Best Color Example" />
            </div>
          </div>

          {/* 점선 구분선 */}
          <div className="divider"></div>

          {/* Worst Color Section */}
          <div className="container-worst">
            <h1 className="title">Worst Color</h1>
            <div className="worst-image">
              {/* Worst Color 목록에서 색상값을 렌더링 */}
              <ul>
                {personalColorDetails.worstcolor_name?.map((color, index) => (
                  <li key={index}>{color}</li>
                ))}
              </ul>
              <img src={worstImage} alt="Worst Color Example" />
            </div>
          </div>
        </div>
      </SmallMain>
      <Bottombar />
    </Background>
  );
};

export default BestWorst;