import React from 'react';
import Background from "../../background/background/Background";
import Smallmain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import MakeupCamera from './MakeupCamera';
import ProductButton from '../../button/product-button/ProductButton';
import "./Makeup.css";

const MakeupByColor = () => {
  return (
    <div className="camera-container">
      <Background>
        <Topbar />
        
        <Smallmain>
          {/* 왼쪽 패널 - 버튼 */}
          <div className="left-panel">
            <div className="button-container">
              <ProductButton text="립" />
              <ProductButton text="아이섀도우" />
              <ProductButton text="치크" />
            </div>
          </div>

          {/* 오른쪽 패널 - 카메라 */}
          <div className="right-panel">
            <MakeupCamera />
          </div>
        </Smallmain>

        <Bottombar />
      </Background>
    </div>
  );
};


export default MakeupByColor;