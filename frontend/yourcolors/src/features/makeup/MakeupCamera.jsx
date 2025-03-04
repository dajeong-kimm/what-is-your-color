import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import "../makeup/MakeupCamera.css";
import useWebcamStore from "../../store/useWebcamStore"; // Zustand 상태 가져오기

const MakeupCamera = ({ cam, eyeShadowColor, blushColor, lipColor, category }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Zustand에서 웹캠 상태 가져오기
  const { stream, startCamera, stopCamera } = useWebcamStore();

  // 립 컨트롤 상태
  const [lipBlur, setLipBlur] = useState(10);
  const [lipIntensity, setLipIntensity] = useState(0.5);

  // 아이섀도우 컨트롤 상태
  const [eyeBlur, setEyeBlur] = useState(10);
  const [eyeIntensity, setEyeIntensity] = useState(0.5);

  // 블러시 컨트롤 상태
  const [blushBlur, setBlushBlur] = useState(10);
  const [blushIntensity, setBlushIntensity] = useState(0.5);

  // 최신 값을 위한 refs
  const lipBlurRef = useRef(lipBlur);
  const lipIntensityRef = useRef(lipIntensity);
  const eyeBlurRef = useRef(eyeBlur);
  const eyeIntensityRef = useRef(eyeIntensity);
  const blushBlurRef = useRef(blushBlur);
  const blushIntensityRef = useRef(blushIntensity);
  const [showControls, setShowControls] = useState(false);

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

  // "원본" 버튼 상태: true이면 메이크업 효과를 숨김 (원본 영상 표시)
  const [isOriginal, setIsOriginal] = useState(false);
  const isOriginalRef = useRef(isOriginal);
  useEffect(() => {
    isOriginalRef.current = isOriginal;
  }, [isOriginal]);

  // 디버그용 콘솔 출력
  console.log("eyeShadowColor:", eyeShadowColor);
  console.log("category:", category);
  console.log("lipColor:", lipColor);
  console.log("blushColor:", blushColor);
  console.log("립 - 블러:", lipBlur, "강도:", lipIntensity);
  console.log("아이섀도우 - 블러:", eyeBlur, "강도:", eyeIntensity);
  console.log("블러시 - 블러:", blushBlur, "강도:", blushIntensity);

  // Zustand 값이 변경될 때 영상 연결
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((error) => console.error("Play 오류:", error));
    }
  }, [stream]);

  // 얼굴 랜드마크 세팅
  useEffect(() => {
    const setupFaceLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      faceLandmarkerRef.current = faceLandmarker;
    };

    setupFaceLandmarker();
  }, []);

  // 카메라 시작
  useEffect(() => {
    startCamera();
    // return () => stopCamera(); // 컴포넌트 언마운트 시 카메라 정지
  }, [startCamera, stopCamera]);

  // 색상 변경 시 메이크업 다시 적용
  useEffect(() => {
    if (canvasRef.current) {
      detectFaces();
    }
  }, [eyeShadowColor, blushColor, lipColor]);

  // 기존의 drawSmoothRegion (눈, 볼 등 용)
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

  // 새로 추가된 함수: 입술 영역(UPPER_LIP + LOWER_LIP)을 하나의 클리핑 영역으로 사용하여 블러 효과를 내부에만 적용
  const drawLipRegion = (ctx, landmarks, color, blur, intensity) => {
    // 외곽 입술 영역을 하나의 경로로 생성
    // UPPER_LIP와 LOWER_LIP 배열을 결합하여 클로즈드 폴리곤 생성
    const UPPER_LIP = [
      61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 306, 292, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 62,
      76,
    ];
    const LOWER_LIP = [
      61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 62,
      76, 61,
    ];

    ctx.save();
    ctx.beginPath();
    // 먼저 UPPER_LIP 순서대로 그리기
    for (let i = 0; i < UPPER_LIP.length; i++) {
      const idx = UPPER_LIP[i];
      const pt = landmarks[idx];
      const x = (1 - pt.x) * canvasRef.current.width;
      const y = pt.y * canvasRef.current.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    // 그 다음 LOWER_LIP를 역순으로 그려서 닫힌 경로 생성
    for (let i = LOWER_LIP.length - 1; i >= 0; i--) {
      const idx = LOWER_LIP[i];
      const pt = landmarks[idx];
      const x = (1 - pt.x) * canvasRef.current.width;
      const y = pt.y * canvasRef.current.height;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    // 클리핑 영역 설정: 입술 영역 안으로만 그리기
    ctx.clip();

    // 클리핑 영역 내에서 동일한 경로를 다시 그려서 블러 효과 적용
    ctx.save();
    ctx.filter = `blur(${blur}px)`;
    ctx.globalAlpha = intensity;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < UPPER_LIP.length; i++) {
      const idx = UPPER_LIP[i];
      const pt = landmarks[idx];
      const x = (1 - pt.x) * canvasRef.current.width;
      const y = pt.y * canvasRef.current.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (let i = LOWER_LIP.length - 1; i >= 0; i--) {
      const idx = LOWER_LIP[i];
      const pt = landmarks[idx];
      const x = (1 - pt.x) * canvasRef.current.width;
      const y = pt.y * canvasRef.current.height;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.restore();
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 메이크업 효과는 isOriginal 상태가 false일 때만 적용
    if (results.faceLandmarks.length > 0 && !isOriginalRef.current) {
      const landmarks = results.faceLandmarks[0];

      // 입술 영역에 메이크업 효과 적용
      drawLipRegion(ctx, landmarks, lipColor || "rgba(0,0,0,0)", lipBlurRef.current, lipIntensityRef.current);

      // 눈섀도우 및 블러시 영역 처리
      const LEFT_EYE_SHADOW = [33, 130, 226, 247, 30, 29, 27, 28, 56, 190, 243, 133, 173, 157, 158, 159, 160, 161, 246];
      const RIGHT_EYE_SHADOW = [
        263, 359, 446, 467, 260, 259, 257, 258, 286, 414, 463, 353, 383, 362, 398, 384, 385, 386, 466,
      ];
      const LEFT_BLUSH = [117, 101, 205, 187, 123, 116, 117];
      const RIGHT_BLUSH = [411, 352, 346, 347, 330, 425, 411];

      drawSmoothRegion(
        ctx,
        landmarks,
        LEFT_EYE_SHADOW,
        eyeShadowColor || "rgba(0,0,0,0)",
        eyeBlurRef.current,
        eyeIntensityRef.current
      );
      drawSmoothRegion(
        ctx,
        landmarks,
        RIGHT_EYE_SHADOW,
        eyeShadowColor || "rgba(0,0,0,0)",
        eyeBlurRef.current,
        eyeIntensityRef.current
      );
      drawSmoothRegion(
        ctx,
        landmarks,
        LEFT_BLUSH,
        blushColor || "rgba(0,0,0,0)",
        blushBlurRef.current,
        blushIntensityRef.current
      );
      drawSmoothRegion(
        ctx,
        landmarks,
        RIGHT_BLUSH,
        blushColor || "rgba(0,0,0,0)",
        blushBlurRef.current,
        blushIntensityRef.current
      );
    }

    animationFrameRef.current = requestAnimationFrame(detectFaces);
  };

  return (
    <div className={`camera ${cam}`} style={{ position: "relative", height: "100%" }}>
      <video ref={videoRef} autoPlay playsInline className="camera-video" style={{ display: "none" }} />
      <canvas ref={canvasRef} className="camera-overlay"></canvas>

      {/* 컨트롤러 토글 버튼 */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 500,
          padding: "10px 16px",
          background: "rgba(130, 220, 40, 0.40)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#82DC28")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(130, 220, 40, 0.40)")}
      >
        {showControls ? "숨기기" : "색상미세조정"}
      </button>

      {/* 원본 버튼: 누르고 있는 동안 메이크업 효과 제거 (스타일을 색상미세조정 버튼과 동일하게, 카메라 하단 오른쪽 배치) */}
      <button
        onMouseDown={() => setIsOriginal(true)}
        onMouseUp={() => setIsOriginal(false)}
        onMouseLeave={() => setIsOriginal(false)}
        onTouchStart={() => setIsOriginal(true)}
        onTouchEnd={() => setIsOriginal(false)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1001,
          padding: "10px 16px",
          background: "rgba(130, 220, 40, 0.40)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#82DC28")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(130, 220, 40, 0.40)")}
      >
        원본
      </button>

      {/* 컨트롤러 UI */}
      {showControls && (
        <div
          className="controls"
          style={{
            position: "absolute",
            bottom: "60%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            gap: "10px",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.6)",
            padding: "8px 24px",
            borderRadius: "16px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
          }}
        >
          {/* 립 컨트롤 */}
          <div style={{ color: "#fff", textAlign: "center", minWidth: "100px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px", fontSize: "1.1rem" }}>💄 LIP</div>
            <label style={{ display: "block", margin: "6px 0" }}>
              블러
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={lipBlur}
                onChange={(e) => setLipBlur(Number(e.target.value))}
                style={{ width: "100%", accentColor: "green" }}
              />
            </label>
            <label style={{ display: "block", margin: "6px 0" }}>
              채도
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={lipIntensity}
                onChange={(e) => setLipIntensity(Number(e.target.value))}
                style={{ width: "100%", accentColor: "green" }}
              />
            </label>
          </div>

          {/* 아이섀도우 컨트롤 */}
          <div style={{ color: "#fff", textAlign: "center", minWidth: "100px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px", fontSize: "1.1rem" }}>👁️ EYE</div>
            <label style={{ display: "block", margin: "6px 0" }}>
              블러
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={eyeBlur}
                onChange={(e) => setEyeBlur(Number(e.target.value))}
                style={{ width: "100%", accentColor: "green" }}
              />
            </label>
            <label style={{ display: "block", margin: "6px 0" }}>
              채도
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={eyeIntensity}
                onChange={(e) => setEyeIntensity(Number(e.target.value))}
                style={{ width: "100%", accentColor: "green" }}
              />
            </label>
          </div>

          {/* 블러시 컨트롤 */}
          <div style={{ color: "#fff", textAlign: "center", minWidth: "100px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px", fontSize: "1.1rem" }}>🌸 CHEEK</div>
            <label style={{ display: "block", margin: "6px 0" }}>
              블러
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={blushBlur}
                onChange={(e) => setBlushBlur(Number(e.target.value))}
                style={{ width: "100%", accentColor: "green" }}
              />
            </label>
            <label style={{ display: "block", margin: "6px 0" }}>
              채도
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={blushIntensity}
                onChange={(e) => setBlushIntensity(Number(e.target.value))}
                style={{ width: "100%", accentColor: "green" }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeupCamera;
