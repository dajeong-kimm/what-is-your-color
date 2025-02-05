// import React, { useEffect, useRef } from 'react';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import '../makeup/MakeupCamera.css';

// const MakeupCamera = ({ className }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const faceMesh = new FaceMesh({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//     });

//     faceMesh.setOptions({
//       maxNumFaces: 1,
//       refineLandmarks: true,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     faceMesh.onResults((results) => {
//       if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;
//       const canvasCtx = canvasRef.current.getContext('2d');

//       // 캔버스 초기화
//       canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//       // 캔버스 좌우 반전 적용 (비디오와 동일한 방향)
//       canvasCtx.save();
//       canvasCtx.translate(canvasRef.current.width, 0);
//       canvasCtx.scale(-1, 1); // 좌우 반전

//       // 얼굴 랜드마크 그리기
//       drawFaceMesh(results.multiFaceLandmarks[0], canvasCtx);

//       canvasCtx.restore(); // 변환 초기화
//     });

//     if (videoRef.current) {
//       const camera = new Camera(videoRef.current, {
//         onFrame: async () => {
//           await faceMesh.send({ image: videoRef.current });
//         },
//         width: 640,
//         height: 480,
//       });
//       camera.start();
//     }
//   }, []);

//   // 얼굴 랜드마크 그리기
//   const drawFaceMesh = (landmarks, ctx) => {
//     ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // 반투명한 붉은색

//     // 입술 (입술 모양을 따라가는 타원)
//     drawLips(ctx, landmarks);

//     // 치크 (광대뼈에 원 모양으로 수정)
//     drawCircle(ctx, landmarks[50], 8); // 왼쪽 치크
//     drawCircle(ctx, landmarks[280], 8); // 오른쪽 치크

//     // 눈 (눈 위쪽만, 전체 모양을 유지)
//     drawUpperEyelid(ctx, landmarks, [33, 160, 159, 158, 133]); // 왼쪽 눈
//     drawUpperEyelid(ctx, landmarks, [362, 385, 386, 387, 263]); // 오른쪽 눈
//   };

//   // **✅ 입술 모양을 따라가는 타원 그리기**
//   const drawLips = (ctx, landmarks) => {
//     if (!landmarks) return;

//     // 입술 좌표 (상하 좌표를 활용하여 타원 형태 결정)
//     const upperLip = [61, 146, 91, 181, 84, 17]; // 윗입술
//     const lowerLip = [314, 405, 321, 375, 291]; // 아랫입술

//     let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

//     // 입술의 가장 바깥쪽 좌표 찾기
//     [...upperLip, ...lowerLip].forEach(index => {
//       const x = landmarks[index].x * ctx.canvas.width;
//       const y = landmarks[index].y * ctx.canvas.height;

//       if (x < minX) minX = x;
//       if (x > maxX) maxX = x;
//       if (y < minY) minY = y;
//       if (y > maxY) maxY = y;
//     });

//     // 입술의 중앙 좌표 계산
//     const centerX = (minX + maxX) / 2;
//     const centerY = (minY + maxY) / 2;
//     const width = Math.abs(maxX - minX);
//     const height = Math.abs(maxY - minY) * 1.2; // 약간 더 큰 타원으로 만들기

//     // 타원 그리기
//     ctx.beginPath();
//     ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
//     ctx.fill();
//   };

//   // **✅ 원 그리기 함수 (치크)**
//   const drawCircle = (ctx, point, radius) => {
//     if (!point) return;

//     const x = point.x * ctx.canvas.width;
//     const y = point.y * ctx.canvas.height;

//     ctx.beginPath();
//     ctx.arc(x, y, Math.abs(radius), 0, 2 * Math.PI);
//     ctx.fill();
//   };

//   // **✅ 눈꺼풀 위쪽만 칠하는 함수**
//   const drawUpperEyelid = (ctx, landmarks, indices) => {
//     if (!landmarks) return;

//     ctx.beginPath();
//     indices.forEach((index, i) => {
//       if (!landmarks[index]) return;
//       const x = landmarks[index].x * ctx.canvas.width;
//       const y = landmarks[index].y * ctx.canvas.height;
//       if (i === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     });
//     ctx.closePath();
//     ctx.fill();
//   };

//   return (
//     <div className={`camera ${className}`}>
//       <video ref={videoRef} autoPlay playsInline className="camera-video" />
//       <canvas ref={canvasRef} className="camera-overlay"></canvas>
//     </div>
//   );
// };

// export default MakeupCamera;

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
