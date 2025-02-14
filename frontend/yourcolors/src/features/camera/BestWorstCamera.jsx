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

const BestWorstCamera = () => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    getWebcam((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '115%', position: 'relative', overflow: 'hidden' }}>
          {/* 컬러풀한 세그먼트 */}
 

          


          {/* 세이브본 */}

          <div  
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#A833FF',
            clipPath: 'polygon(50% 50%, 0% 25%, 0% 0, 50% 0%)',
            zIndex: 2,
        }}
          />
          

                
            <div
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#FF5733',
            clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 25%)',
            zIndex: 2,
        }}
        />
        <div
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#33FF57',
            clipPath: 'polygon(50% 50%, 100% 25%, 100% 100%, 75% 100%)',
            zIndex: 2,
        }}
        />
        <div
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#5733FF',
            clipPath: 'polygon(50% 50%, 95% 100%, 5% 100%, 50% 50%)',
            zIndex: 2,
        }}
        />
        <div
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#F4C300',
            clipPath: 'polygon(50% 50%, 5% 100%, 25% 100%, 0% 100%, 0% 25%)',
            zIndex: 2,
        }}
        />




        {/* 카메라 영상 */}
        {/* 얼굴 가이드라인 */}
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
            clipPath: 'circle(25% at 50% 50%)',  // 원형으로 비디오 클리핑
            transform: "scaleX(-1)",
          zIndex: 3,
        }}
      />

 

    </div>
  );
};

export default BestWorstCamera;