import React from "react";
import Background from "../../background/background/Background";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/Bottombar";
import bestImage from "./여름뮤트베스트컬러.jpg"; // 이미지 import
import worstImage from "./여름뮤트워스트컬러.jpg"; // 이미지 import
import "./BestWorst.css"; // 스타일 import

const BestWorst = () => {
  return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="full-container">
          {/* Best Color Section */}
          <div className="container-best">
            <h1 className="title">Best Color</h1>
            <div className="best-image">
              <img src={bestImage} alt="Best Color Example" />
            </div>
          </div>

          {/* 점선 구분선 */}
          <div className="divider"></div>

          {/* Worst Color Section */}
          <div className="container-worst">
            <h1 className="title">Worst Color</h1>
            <div className="worst-image">
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
