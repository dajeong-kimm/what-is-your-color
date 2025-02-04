import React from 'react';
import '../camera/camera.css';

const getWebcam = (callback) => {
  try {
    const constraints = {
      video: true,
      audio: false,
    };
    navigator.mediaDevices.getUserMedia(constraints).then(callback);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const Camera = () => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    getWebcam((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '115%', position: 'relative', overflow: 'hidden' }}>
      {/* 카메라 영상 */}
      <video
        ref={videoRef}
        autoPlay
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* 얼굴 가이드라인 */}
      <div
        style={{
          position: 'absolute',
          border: '8px dashed yellow',
          width: '30%',
          height: '70%',
          top: '15%',
          left: '35%',
          borderRadius: '50%',
          pointerEvents: 'none',
          borderWidth: '5px',
          borderSpacing: '12px',
        }}
      />

       {/* 안내 문구 */}
       <div
        style={{
          position: 'absolute',
          top: '7%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px',
          textAlign: 'center',
          pointerEvents: 'none',
          
        }}
      >
        얼굴을 가이드라인에 맞게 위치시켜 주세요
      </div>


      {/* A4 가이드 박스 */}
      <div
        style={{
          position: 'absolute',
          border: '6px dashed yellow',
          width: '15%',
          height: '40%',
          top: '30%',
          left: '70%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Camera;
