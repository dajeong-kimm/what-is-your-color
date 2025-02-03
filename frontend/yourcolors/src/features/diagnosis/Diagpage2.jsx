import React from 'react';
import { useLocation } from 'react-router-dom';
import Background from '../../background/background/Background';
import Smallmain from '../../background/background/SmallMain';
import Topbar from '../../button/top/Topbar';
import Bottombar from '../../button/bottom/Bottombar';
import DiagnosticBox from '../../button/diagnosticbox/DiagnosticBox';

const Diagpage2 = () => {
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;

  return (
    <div className="camera-container">
      <Background>
        <Smallmain>
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: '100%', height: '115%', objectFit: 'cover' }}
            />
          )}
          {DiagnosticBox}
        </Smallmain>
        <Topbar />
        <Bottombar />
      </Background>
    </div>
  );
};

export default Diagpage2;
