import React from 'react';
import Camera from './Diagcamera';  // Camera 컴포넌트 import
import Background from "../../background/background/BackGround";
import Smallmain from "../../background/background/SmallMain";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import MediapipeCameraTimer from '../camera/MediapipeCameraTimer';
const DiagCaptureX = () => {
  return (
    
      <div className="camera-container">
        
      <Background>
      <Largemain>
			<MediapipeCameraXTimer/>
			</Largemain>
      <Topbar />
      {/* <Bottombar /> */}
    </Background>
      </div>
    
  );
};

export default DiagCaptureX;

