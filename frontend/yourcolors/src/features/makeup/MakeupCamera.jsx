import React, { useEffect, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import '../makeup/MakeupCamera.css';

const MakeupCamera = ({ className }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;
      const canvasCtx = canvasRef.current.getContext('2d');
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawFaceMesh(results.multiFaceLandmarks[0], canvasCtx);
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  // 얼굴 랜드마크 그리기
  const drawFaceMesh = (landmarks, ctx) => {
    ctx.strokeStyle = '#00FF00'; // 초록색 선
    ctx.lineWidth = 1;

    // 입술
    drawRegion(ctx, landmarks, [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]);
    // 치크 (광대뼈)
    drawRegion(ctx, landmarks, [50, 280, 352, 430]);
    // 눈 (눈꺼풀)
    drawRegion(ctx, landmarks, [33, 160, 158, 133, 153, 144, 362, 385, 387, 263, 373, 380]);
  };

  // 특정 부위 그리기 함수
  const drawRegion = (ctx, landmarks, indices) => {
    ctx.beginPath();
    ctx.moveTo(landmarks[indices[0]].x * canvasRef.current.width, landmarks[indices[0]].y * canvasRef.current.height);
    indices.forEach((index) => {
      ctx.lineTo(landmarks[index].x * canvasRef.current.width, landmarks[index].y * canvasRef.current.height);
    });
    ctx.closePath();
    ctx.stroke();
  };

  return (
    <div className={`camera ${className}`}>
      <video ref={videoRef} autoPlay playsInline className="camera-video" />
      <canvas ref={canvasRef} className="camera-overlay"></canvas>
    </div>
  );
};

export default MakeupCamera;
