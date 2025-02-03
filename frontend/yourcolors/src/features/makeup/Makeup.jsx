import React from 'react';
import Background from "../../background/background/Background";
import Smallmain from "../../background/background/SmallMain";
import Topbar from "../../button/top/Topbar";
import Bottombar from "../../button/bottom/Bottombar";
import MakeupCamera from '../makeup/MakeupCamera';
const Makeup = () => {
  return (
    
  <div className="camera-container">
    <Background>
      <Topbar />
        <Smallmain>
          <MakeupCamera/>
        </Smallmain>
      <Bottombar />
    </Background>
  </div>
    
  );
};

export default Makeup;

