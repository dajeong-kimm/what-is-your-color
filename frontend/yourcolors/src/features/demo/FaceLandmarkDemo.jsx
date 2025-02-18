// 📌 FaceLandmarkDemo.jsx
import React, { useEffect, useRef } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import "./FaceLandmarkDemo.css"; // 스타일링을 위한 CSS

const FaceLandmarkDemo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // 🟡 1. Mediapipe FaceLandmarker 설정
  const setupFaceLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
    });

    faceLandmarkerRef.current = faceLandmarker;
  };

  // 🟡 2. 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      detectFaces();
    } catch (error) {
      console.error("카메라 접근 실패:", error);
    }
  };

  // 🟡 3. 얼굴 인식 및 시각화
  const detectFaces = async () => {
    if (
      !faceLandmarkerRef.current ||
      !videoRef.current ||
      !canvasRef.current
    ) {
      animationFrameRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 얼굴 인식
    const results = await faceLandmarkerRef.current.detectForVideo(
      video,
      performance.now()
    );

    // 비디오를 좌우 반전하며 캔버스에 출력
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 🟢 얼굴 랜드마크 그리기
    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];

      // 랜드마크 포인트 표시
      ctx.fillStyle = "#00FF00";
      ctx.font = "12px Arial";

      landmarks.forEach((point, index) => {
        const x = (1 - point.x) * canvas.width;
        const y = point.y * canvas.height;

        // 🔵 점 표시
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();

        // 🔴 랜드마크 번호 라벨링
        ctx.fillStyle = "#FF0000";
        ctx.fillText(`${index}`, x + 5, y - 5);
      });

      // 얼굴 윤곽선 연결
      drawLine(ctx, landmarks, FACE_OUTLINE, "#FFD700", 2);
      drawLine(ctx, landmarks, LEFT_EYE, "#00FFFF", 2);
      drawLine(ctx, landmarks, RIGHT_EYE, "#00FFFF", 2);
      drawLine(ctx, landmarks, LIPS, "#FF69B4", 2);
    }

    animationFrameRef.current = requestAnimationFrame(detectFaces);
  };

  // 🟡 4. 랜드마크 연결선 그리기 함수
  const drawLine = (ctx, landmarks, indices, color, lineWidth) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    indices.forEach((index, i) => {
      const point = landmarks[index];
      const x = (1 - point.x) * canvasRef.current.width;
      const y = point.y * canvasRef.current.height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.stroke();
  };

  // 🟡 5. 랜드마크 포인트 배열 정의 (Mediapipe 기반)
  const FACE_OUTLINE = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323,
    361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
    176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162,
  ];
  const LEFT_EYE = [33, 133, 160, 159, 158, 157, 173, 133];
  const RIGHT_EYE = [263, 362, 387, 386, 385, 384, 398, 362];
  const LIPS = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375,
    291, 308, 324, 318, 402, 317, 14, 87, 178, 88,
  ];

  // 🟡 6. 컴포넌트 실행 시 초기화
  useEffect(() => {
    setupFaceLandmarker();
    startCamera();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="face-landmark-demo">
      {/* 📹 비디오 요소 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ display: "none" }}
      />
      {/* 🖌️ 얼굴 랜드마크 캔버스 */}
      <canvas ref={canvasRef} className="overlay-canvas" />
    </div>
  );
};

export default FaceLandmarkDemo;
