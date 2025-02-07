import React from 'react';
import { useLocation } from 'react-router-dom';
import Background from '../../background/background/BackGround';
import Smallmain from '../../background/background/SmallMain';
import Topbar from '../../button/top/TopBar';
import Bottombar from '../../button/bottom/BottomBar';
import DiagnosticBox from '../../button/diagnosticbox/DiagnosticBox';

const DiagImage = () => {
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;

  return (
    <div className="camera-container" style={{ position: 'relative' }}>
      <Background>
        <Smallmain>
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              style={{
                width: '100%',
                height: '115%',
                objectFit: 'cover',
                position: 'relative', // DiagnosticBox와 겹치기 위한 설정
              }}
            />
          )}
          {/* DiagnosticBox를 겹쳐서 왼쪽에 배치 */}
          <div
            style={{
              position: 'absolute',
              top: '12%', // 원하는 위치 조정
              left: '7%', // 왼쪽으로 이동
              zIndex: 10, // 이미지 위에 오도록 설정
            }}
          >
            <DiagnosticBox />
          </div>
        </Smallmain>
        <Topbar />
        <Bottombar />
      </Background>
    </div>
  );
};

export default DiagImage;
