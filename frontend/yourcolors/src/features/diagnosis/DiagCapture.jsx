import React from 'react';
import Camera from './Diagcamera';  // Camera 컴포넌트 import
import Background from "../../background/background/Background";
import Smallmain from "../../background/background/SmallMain";
import Topbar from "../../button/top/Topbar";
import Bottombar from "../../button/bottom/Bottombar";
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

