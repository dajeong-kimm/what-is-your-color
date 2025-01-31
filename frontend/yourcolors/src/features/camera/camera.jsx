import React from 'react';
import { Button } from 'reactstrap';
import '../camera/camera.css';

const getWebcam = (callback) => {
  try {
    const constraints = {
      'video': true,
      'audio': false
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(callback);
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

const Styles = {
  Video: { width: "100%", height: "100%", background: 'rgba(255, 255, 255, 0.5)' },
  None: { display: 'none' },
}

const Camera = () => {  // TestOverlay를 Camera로 이름 변경
    const [playing, setPlaying] = React.useState(undefined);
  
    const videoRef = React.useRef(null);
  
    React.useEffect(() => {
      getWebcam((stream => {
        setPlaying(true);
        videoRef.current.srcObject = stream;
      }));
    }, []);
  
    const startOrStop = () => {
      if (playing) {
        const s = videoRef.current.srcObject;
        s.getTracks().forEach((track) => {
          track.stop();
        });
      } else {
        getWebcam((stream => {
          setPlaying(true);
          videoRef.current.srcObject = stream;
        }));
      }
      setPlaying(!playing);
    }
  
    return (
      <div style={{ width: '100%', height: '100%', padding: '1em' }}>
        <video ref={videoRef} autoPlay style={Styles.Video} />
      </div>
    );
}
  
export default Camera; 