import React from 'react';
import Camera from './DiagCamera';  // Camera 컴포넌트 import
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import MediapipeCameraTimer from '../camera/MediapipeCameraTimer';
const DiagCapture = () => {
  return (
    
      <div className="camera-container">
        
      <Background>
      <Largemain>
			<MediapipeCameraTimer/>
			</Largemain>
      <Topbar />
      {/* <Bottombar /> */}
    </Background>
      </div>
    
  );
};

export default DiagCapture;

