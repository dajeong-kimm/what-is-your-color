import React from 'react';
import Camera from './DiagCamera';  // Camera 컴포넌트 import
import Background from "../../background/background/Background";
import Smallmain from "../../background/background/SmallMain";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import MediapipeCameraXTimerAI from '../camera/MediapipeCameraXTimerAI';
const DiagCaptureXAI = () => {
  return (
    
      <div className="camera-container">
        
      <Background>
      <Largemain>
			<MediapipeCameraXTimerAI/>
			</Largemain>
      <Topbar />
      {/* <Bottombar /> */}
    </Background>
      </div>
    
  );
};

export default DiagCaptureXAI;

