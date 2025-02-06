import React from 'react';
import Camera from './Diagcamera';  // Camera 컴포넌트 import
import Background from "../../background/background/BackGround";
import Smallmain from "../../background/background/SmallMain";
import Topbar from "../../button/top/Topbar";
import Bottombar from "../../button/bottom/Bottombar";
import MediapipeCameraX from '../camera/mediapipecameraX';
const DiagCaptureX = () => {
  return (
    
      <div className="camera-container">
        
      <Background>
      <Smallmain>
			<MediapipeCameraX/>
			</Smallmain>
      <Topbar />
      <Bottombar />
    </Background>
      </div>
    
  );
};

export default DiagCaptureX;

