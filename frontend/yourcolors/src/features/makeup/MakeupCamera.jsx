import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import "../makeup/MakeupCamera.css";

const MakeupCamera = ({ cam, eyeShadowColor, blushColor, lipColor, category }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // 립 조절 상태
  const [lipBlur, setLipBlur] = useState(10);         // 기본 10px, 최대 20px
  const [lipIntensity, setLipIntensity] = useState(1);  // 0 ~ 1

  // 아이섀도우 조절 상태
  const [eyeBlur, setEyeBlur] = useState(10);           // 기본 10px, 최대 20px
  const [eyeIntensity, setEyeIntensity] = useState(1);    // 0 ~ 1

  // 블러시(치크) 조절 상태
  const [blushBlur, setBlushBlur] = useState(10);         // 기본 10px, 최대 20px
  const [blushIntensity, setBlushIntensity] = useState(1);  // 0 ~ 1

  // 최신 값을 위한 refs
  const lipBlurRef = useRef(lipBlur);
  const lipIntensityRef = useRef(lipIntensity);
  const eyeBlurRef = useRef(eyeBlur);
  const eyeIntensityRef = useRef(eyeIntensity);
  const blushBlurRef = useRef(blushBlur);
  const blushIntensityRef = useRef(blushIntensity);

  useEffect(() => {
    lipBlurRef.current = lipBlur;
  }, [lipBlur]);
  useEffect(() => {
    lipIntensityRef.current = lipIntensity;
  }, [lipIntensity]);
  useEffect(() => {
    eyeBlurRef.current = eyeBlur;
  }, [eyeBlur]);
  useEffect(() => {
    eyeIntensityRef.current = eyeIntensity;
  }, [eyeIntensity]);
  useEffect(() => {
    blushBlurRef.current = blushBlur;
  }, [blushBlur]);
  useEffect(() => {
    blushIntensityRef.current = blushIntensity;
  }, [blushIntensity]);

  // 디버그용 콘솔 출력
  console.log("eyeShadowColor:", eyeShadowColor);
  console.log("category:", category);
  console.log("lipColor:", lipColor);
  console.log("blushColor:", blushColor);
  console.log("Lip - Blur:", lipBlur, "Intensity:", lipIntensity);
  console.log("Eyeshadow - Blur:", eyeBlur, "Intensity:", eyeIntensity);
  console.log("Blush - Blur:", blushBlur, "Intensity:", blushIntensity);

  useEffect(() => {
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

    const startCamera = async () => {
      try {
        if (videoRef.current) {
          const currentStream = videoRef.current.srcObject;
          if (currentStream) {
            currentStream.getTracks().forEach((track) => track.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;

          videoRef.current.load();
          setTimeout(() => {
            videoRef.current.play().catch((error) =>
              console.error("Play 오류:", error)
            );
          }, 500);

          detectFaces();
        }
      } catch (error) {
        console.error("카메라 접근 오류:", error);
      }
    };

    (async () => {
      await setupFaceLandmarker();
      await startCamera();
    })();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 색상 변경 시 메이크업 다시 적용
  useEffect(() => {
    if (canvasRef.current) {
      detectFaces();
    }
  }, [eyeShadowColor, blushColor, lipColor]);

  // drawSmoothRegion 함수: 추가 매개변수 intensity를 받아 globalAlpha를 설정
  const drawSmoothRegion = (ctx, landmarks, indices, color, blur, intensity) => {
    if (indices.length === 0) return;
    ctx.save();
    ctx.beginPath();
    const firstPoint = landmarks[indices[0]];
    ctx.moveTo((1 - firstPoint.x) * canvasRef.current.width, firstPoint.y * canvasRef.current.height);
    // quadraticCurveTo로 부드럽게 연결
    for (let i = 1; i < indices.length - 1; i++) {
      const p1 = landmarks[indices[i]];
      const p2 = landmarks[indices[i + 1]];
      const cpX = (1 - p1.x) * canvasRef.current.width;
      const cpY = p1.y * canvasRef.current.height;
      const endX = (1 - p2.x) * canvasRef.current.width;
      const endY = p2.y * canvasRef.current.height;
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    }
    ctx.closePath();
    ctx.filter = `blur(${blur}px)`;
    ctx.globalAlpha = intensity; // 투명도 적용
    ctx.fillStyle = color;
    ctx.fill();
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.restore();
  };

  const detectFaces = async () => {
    if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!video.videoWidth || !video.videoHeight) {
      animationFrameRef.current = requestAnimationFrame(detectFaces);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const results = await faceLandmarkerRef.current.detectForVideo(video, performance.now());

    // 캔버스 초기화 및 좌우 반전(mirror)한 비디오 이미지 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];

      // 메이크업 적용 영역 정의
      const UPPER_LIP = [
        61, 185, 40, 39, 37, 0, 267, 269, 270, 409,
        291, 306, 292, 308, 415, 310, 311, 312, 13,
        82, 81, 80, 191, 78, 62, 76
      ];
      const LOWER_LIP = [
        61, 146, 91, 181, 84, 17, 314, 405, 321, 375,
        291, 306, 292, 308, 324, 318, 402, 317, 14,
        87, 178, 88, 95, 78, 62, 76, 61
      ];
      const LEFT_EYE_SHADOW = [
        33, 130, 226, 247, 30, 29, 27, 28, 56,
        190, 243, 133, 173, 157, 158, 159, 160, 161, 246
      ];
      const RIGHT_EYE_SHADOW = [
        263, 359, 446, 467, 260, 259, 257, 258, 286,
        414, 463, 353, 383, 362, 398, 384, 385, 386, 466
      ];
      const LEFT_BLUSH = [117, 123, 185, 203, 101, 118, 117];
      const RIGHT_BLUSH = [411, 352, 346, 347, 330, 425, 411];

      // 각 영역별로 개별 설정 적용
      // 립 영역: 상단, 하단 모두 lipBlur와 lipIntensity 적용
      drawSmoothRegion(ctx, landmarks, UPPER_LIP, lipColor || "rgba(0,0,0,0)", lipBlurRef.current, lipIntensityRef.current);
      drawSmoothRegion(ctx, landmarks, LOWER_LIP, lipColor || "rgba(0,0,0,0)", lipBlurRef.current, lipIntensityRef.current);
      // 아이섀도우 영역: 좌우 각각 eyeBlur와 eyeIntensity 적용
      drawSmoothRegion(ctx, landmarks, LEFT_EYE_SHADOW, eyeShadowColor || "rgba(0,0,0,0)", eyeBlurRef.current, eyeIntensityRef.current);
      drawSmoothRegion(ctx, landmarks, RIGHT_EYE_SHADOW, eyeShadowColor || "rgba(0,0,0,0)", eyeBlurRef.current, eyeIntensityRef.current);
      // 블러시(치크) 영역: 좌우 각각 blushBlur와 blushIntensity 적용
      drawSmoothRegion(ctx, landmarks, LEFT_BLUSH, blushColor || "rgba(0,0,0,0)", blushBlurRef.current, blushIntensityRef.current);
      drawSmoothRegion(ctx, landmarks, RIGHT_BLUSH, blushColor || "rgba(0,0,0,0)", blushBlurRef.current, blushIntensityRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(detectFaces);
  };

  return (
    <div className={`camera ${cam}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="camera-video"
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} className="camera-overlay"></canvas>
      {/* 컨트롤 슬라이더 UI */}
      <div
        className="controls"
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          background: "rgba(255,255,255,0.8)",
          padding: "10px",
          borderRadius: "8px",
          maxWidth: "300px"
        }}
      >
        <h3>Lip Controls</h3>
        <div>
          <label>
            Blur: {lipBlur}px
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={lipBlur}
              onChange={(e) => setLipBlur(Number(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Intensity: {lipIntensity}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={lipIntensity}
              onChange={(e) => setLipIntensity(Number(e.target.value))}
            />
          </label>
        </div>

        <h3>Eyeshadow Controls</h3>
        <div>
          <label>
            Blur: {eyeBlur}px
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={eyeBlur}
              onChange={(e) => setEyeBlur(Number(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Intensity: {eyeIntensity}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={eyeIntensity}
              onChange={(e) => setEyeIntensity(Number(e.target.value))}
            />
          </label>
        </div>

        <h3>Blush Controls</h3>
        <div>
          <label>
            Blur: {blushBlur}px
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={blushBlur}
              onChange={(e) => setBlushBlur(Number(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Intensity: {blushIntensity}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={blushIntensity}
              onChange={(e) => setBlushIntensity(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default MakeupCamera;
  