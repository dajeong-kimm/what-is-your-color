import React from 'react';
import CosmeticDiagCamera from '../cosmetic/CosemeticDiagCamera';  // 변경된 카메라 컴포넌트 import
import Background from "../../background/background/Background";
import Smallmain from "../../background/background/SmallMain";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";

const CosmeticDiagnosis = () => {
  return (
    <div className="camera-container">
      <Background>
        <Largemain>
          <CosmeticDiagCamera />
        </Largemain>
        <Topbar />
        {/* <Bottombar /> */}
      </Background>
    </div>
  );
};

export default CosmeticDiagnosis;
