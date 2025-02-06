import React from 'react';
import Camera from './Diagcamera';  // Camera 컴포넌트 import
import Background from "../../background/background/BackGround";
import Smallmain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
const DiagCapture = () => {
  return (
    
      <div className="camera-container">
        
      <Background>
      <Smallmain>
			<Camera/>
			</Smallmain>
      <Topbar />
      <Bottombar />
    </Background>
      </div>
    
  );
};

export default DiagCapture;

