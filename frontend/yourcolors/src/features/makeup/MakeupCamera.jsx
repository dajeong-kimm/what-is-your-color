import React from 'react';
import '../makeup/MakeupCamera.css';

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

const MakeupCamera = () => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    getWebcam((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("웹캠 스트림 연결됨:", stream);
      }
    });
  }, []);

  return (
    <div className="camera">
      <video
        ref={videoRef}
        autoPlay
        playsInline
      />
    </div>
  );
};

export default MakeupCamera;
