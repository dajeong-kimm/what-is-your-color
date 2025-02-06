import React from 'react';
import Background from "../../background/background/BackGround";
import LargeMain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import MakeupCamera from './MakeupCamera';
import ProductButton from '../../button/productbutton/ProductButton';
import "./Makeup.css";

const Makeup = () => {
  return (
    <div className="camera-container">
      <Background>
        <Topbar />

        <LargeMain>
          <div className="largemain">  {/* 수정됨 */}
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
          </div>
        </LargeMain>

      </Background>
    </div>
  );
};

export default Makeup;