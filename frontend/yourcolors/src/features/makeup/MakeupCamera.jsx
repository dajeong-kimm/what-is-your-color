import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import "../makeup/MakeupCamera.css";

const MakeupCamera = ({ cam, eyeShadowColor, blushColor, lipColor, category }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // 립, 아이섀도우, 블러시 컨트롤 상태
  const [lipBlur, setLipBlur] = useState(10);
  const [lipIntensity, setLipIntensity] = useState(1);
  const [eyeBlur, setEyeBlur] = useState(10);
  const [eyeIntensity, setEyeIntensity] = useState(1);
  const [blushBlur, setBlushBlur] = useState(10);
  const [blushIntensity, setBlushIntensity] = useState(1);

  // 최신 값 저장을 위한 refs
  const lipBlurRef = useRef(lipBlur);
  const lipIntensityRef = useRef(lipIntensity);
  const eyeBlurRef = useRef(eyeBlur);
  const eyeIntensityRef = useRef(eyeIntensity);
  const blushBlurRef = useRef(blushBlur);
  const blushIntensityRef = useRef(blushIntensity);

  useEffect(() => { lipBlurRef.current = lipBlur; }, [lipBlur]);
  useEffect(() => { lipIntensityRef.current = lipIntensity; }, [lipIntensity]);
  useEffect(() => { eyeBlurRef.current = eyeBlur; }, [eyeBlur]);
  useEffect(() => { eyeIntensityRef.current = eyeIntensity; }, [eyeIntensity]);
  useEffect(() => { blushBlurRef.current = blushBlur; }, [blushBlur]);
  useEffect(() => { blushIntensityRef.current = blushIntensity; }, [blushIntensity]);

  console.log("eyeShadowColor:", eyeShadowColor);
  console.log("category:", category);
  console.log("lipColor:", lipColor);
  console.log("blushColor:", blushColor);
  console.log("Lip - Blur:", lipBlur, "Intensity:", lipIntensity);
  console.log("Eyeshadow - Blur:", eyeBlur, "Intensity:", eyeIntensity);
  console.log("Blush - Blur:", blushBlur, "Intensity:", blushIntensity);
  
  // 컴포넌트가 켜질 때마다 새로고침을 실행하는 useEffect (한 번만 새로고침하도록 처리)
  useEffect(() => {
    if (!window.location.search.includes('reloaded')) {
      const separator = window.location.href.includes('?') ? '&' : '?';
      const newUrl = window.location.href + separator + 'reloaded=true';
      window.location.replace(newUrl);
    }

    return () => {
      if (window.location.search.includes('reloaded')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('reloaded');
        window.history.replaceState(null, '', url.toString());
      }
    };
  }, []);

  // mediapipe 및 카메라 초기화를 한 번만 수행하도록 함
  useEffect(() => {
    let isCancelled = false;

    const initialize = async () => {
      // mediapipe FaceLandmarker가 아직 없으면 초기화
      if (!faceLandmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        if (isCancelled) return;
        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
        if (isCancelled) return;
        faceLandmarkerRef.current = faceLandmarker;
      }

      // 카메라 시작: 기존 스트림 종료 후 새 스트림 할당
      if (videoRef.current) {
        const currentStream = videoRef.current.srcObject;
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop());
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (isCancelled) return;
          videoRef.current.srcObject = stream;

          // onloadedmetadata 이벤트를 기다려 비디오 크기가 결정되면 재생 시작
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = resolve;
          });
          videoRef.current.play();

          // 모든 초기화가 끝난 후 얼굴 검출 시작
          detectFaces();
        } catch (error) {
          console.error("카메라 접근 오류:", error);
        }
      }
    };

    initialize();

    return () => {
      console.log("MakeupCamera 언마운트됨");
      isCancelled = true;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      
      // FaceLandmarker 인스턴스 종료 (해제)
      if (faceLandmarkerRef.current && typeof faceLandmarkerRef.current.close === "function") {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
        console.log("FaceLandmarker 종료됨");
      }
    
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null; // 스트림 참조 해제
        console.log("스트림 참조 해제됨");
      }
    };
    
  }, []);

  // 부드러운 영역 그리기 함수
  const drawSmoothRegion = (ctx, landmarks, indices, color, blur, intensity) => {
    if (indices.length === 0) return;
    ctx.save();
    ctx.beginPath();
    const firstPoint = landmarks[indices[0]];
    ctx.moveTo((1 - firstPoint.x) * canvasRef.current.width, firstPoint.y * canvasRef.current.height);
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
    ctx.globalAlpha = intensity;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.restore();
  };

  // 얼굴 검출 및 메이크업 적용 루프
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

    // 캔버스에 좌우 반전된 비디오 이미지 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];

      // 메이크업 적용 영역 정의
      const UPPER_LIP = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 306, 292, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 62, 76];
      const LOWER_LIP = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 62, 76, 61];
      const LEFT_EYE_SHADOW = [33, 130, 226, 247, 30, 29, 27, 28, 56, 190, 243, 133, 173, 157, 158, 159, 160, 161, 246];
      const RIGHT_EYE_SHADOW = [263, 359, 446, 467, 260, 259, 257, 258, 286, 414, 463, 353, 383, 362, 398, 384, 385, 386, 466];
      const LEFT_BLUSH = [117, 123, 185, 203, 101, 118, 117];
      const RIGHT_BLUSH = [411, 352, 346, 347, 330, 425, 411];

      // 각 영역에 대해 메이크업 적용
      drawSmoothRegion(ctx, landmarks, UPPER_LIP, lipColor || "rgba(0,0,0,0)", lipBlurRef.current, lipIntensityRef.current);
      drawSmoothRegion(ctx, landmarks, LOWER_LIP, lipColor || "rgba(0,0,0,0)", lipBlurRef.current, lipIntensityRef.current);
      drawSmoothRegion(ctx, landmarks, LEFT_EYE_SHADOW, eyeShadowColor || "rgba(0,0,0,0)", eyeBlurRef.current, eyeIntensityRef.current);
      drawSmoothRegion(ctx, landmarks, RIGHT_EYE_SHADOW, eyeShadowColor || "rgba(0,0,0,0)", eyeBlurRef.current, eyeIntensityRef.current);
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
      <canvas ref={canvasRef} className="camera-overlay" />
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
          maxWidth: "300px",
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
