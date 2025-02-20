import React, { useEffect, useState, useRef } from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useNavigate, useLocation } from "react-router-dom";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import "./PhotoCapturePage.css";

const PhotoCapturePage = () => {
  const [photos, setPhotos] = useState([]);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const photoCountRef = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Makeup.jsx에서 전달한 선택된 색상 (없으면 기본값)
  const selectedColors = location.state?.selectedColors || {
    lip: { hex: "transparent" },
    eye: { hex: "transparent" },
    cheek: { hex: "transparent" },
  };

  // 기존의 drawSmoothRegion (눈, 볼 등용)
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

  // 새로 추가된 함수: 입술 영역(UPPER_LIP + LOWER_LIP)을 클리핑 영역으로 사용하여 블러가 내부에만 적용되도록 함
  const drawLipRegion = (ctx, landmarks, color, blur, intensity) => {
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
    // UPPER_LIP 순서대로 그리기
    for (let i = 0; i < UPPER_LIP.length; i++) {
      const idx = UPPER_LIP[i];
      const pt = landmarks[idx];
      const x = (1 - pt.x) * canvasRef.current.width;
      const y = pt.y * canvasRef.current.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    // LOWER_LIP를 역순으로 그려 닫힌 경로 생성
    for (let i = LOWER_LIP.length - 1; i >= 0; i--) {
      const idx = LOWER_LIP[i];
      const pt = landmarks[idx];
      const x = (1 - pt.x) * canvasRef.current.width;
      const y = pt.y * canvasRef.current.height;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    // 입술 영역 내로 클리핑
    ctx.clip();

    // 클리핑 영역 내에서 블러 효과 적용
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

    // 좌우 반전 후 캔버스에 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];
      // 입술은 drawLipRegion으로 처리하여 입술 영역 내에서만 블러 효과 적용
      drawLipRegion(ctx, landmarks, selectedColors.lip.hex || "rgba(0,0,0,0)", 10, 0.5);
      // 나머지 부위는 기존 방식 사용
      drawSmoothRegion(ctx, landmarks, LEFT_EYE_SHADOW, selectedColors.eye.hex || "rgba(0,0,0,0)", 10, 0.5);
      drawSmoothRegion(ctx, landmarks, RIGHT_EYE_SHADOW, selectedColors.eye.hex || "rgba(0,0,0,0)", 10, 0.5);
      drawSmoothRegion(ctx, landmarks, LEFT_BLUSH, selectedColors.cheek.hex || "rgba(0,0,0,0)", 10, 0.5);
      drawSmoothRegion(ctx, landmarks, RIGHT_BLUSH, selectedColors.cheek.hex || "rgba(0,0,0,0)", 10, 0.5);
    }
    animationFrameRef.current = requestAnimationFrame(detectFaces);
  };

  // 얼굴 랜드마커 및 카메라 시작
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

    const startCamera = async () => {
      try {
        if (videoRef.current) {
          const currentStream = videoRef.current.srcObject;
          if (currentStream) {
            currentStream.getTracks().forEach((track) => track.stop());
          }
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
          });
          videoRef.current.srcObject = stream;
          videoRef.current.load();
          setTimeout(() => {
            videoRef.current.play().catch((error) => console.error("Play 오류:", error));
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
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
      }
    };
  }, []);

  // 캔버스에 찍힌 메이크업 화면 캡처
  const capturePhoto = () => {
    if (canvasRef.current) {
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
      setPhotos((prev) => {
        const newPhotos = [...prev, imageDataUrl];
        photoCountRef.current = newPhotos.length;
        return newPhotos;
      });
      // 사진 캡처 시 flash 효과 적용
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (photos.length === 8) {
      navigate("/selecttwo", { state: { photos } });
    }
  }, [photos, navigate]);

  // 5초 카운트다운 후 사진 캡처를 반복 (총 8회)
  const startCaptureCycle = () => {
    let count = 1;
    setCountdown(count);
    const intervalId = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(intervalId);
        capturePhoto();
        setTimeout(() => {
          if (photoCountRef.current < 8) {
            startCaptureCycle();
          }
        }, 500);
      }
    }, 1000);
  };

  const handleStart = () => {
    if (!started) {
      setStarted(true);
      startCaptureCycle();
    }
  };

  // 입술, 눈, 볼 랜드마크 배열 (눈, 볼은 그대로 사용)
  const LEFT_EYE_SHADOW = [33, 130, 226, 247, 30, 29, 27, 28, 56, 190, 243, 133, 173, 157, 158, 159, 160, 161, 246];
  const RIGHT_EYE_SHADOW = [
    263, 359, 446, 467, 260, 259, 257, 258, 286, 414, 463, 353, 383, 362, 398, 384, 385, 386, 466,
  ];
  const LEFT_BLUSH = [117, 101, 205, 187, 123, 116, 117];
  const RIGHT_BLUSH = [411, 352, 346, 347, 330, 425, 411];

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="photo-header-bar">
          <span className="photo-title">계절네컷 사진관</span>
          <span className="photo-countdown">{countdown !== null ? countdown : ""}</span>
          <span className="photo-count">{photos.length}/8</span>
        </div>
        <div className="photo-video-container">
          {/* 실제 영상은 숨기고, 메이크업 효과가 적용된 캔버스를 사용 */}
          <video ref={videoRef} autoPlay playsInline className="camera-video" style={{ display: "none" }}></video>
          <canvas ref={canvasRef} className="camera-overlay"></canvas>

          {/* flash 효과를 위한 오버레이 */}
          {flash && <div className="flash-overlay"></div>}

          <div className="makeup-colors-overlay">
            <div className="makeup-color-item">
              <div
                className="makeup-color-circle"
                style={{
                  backgroundColor: selectedColors.lip.hex !== "transparent" ? selectedColors.lip.hex : "#f0f0f0",
                }}
              ></div>
              <div className="makeup-color-label">LIP</div>
            </div>
            <div className="makeup-color-item">
              <div
                className="makeup-color-circle"
                style={{
                  backgroundColor: selectedColors.eye.hex !== "transparent" ? selectedColors.eye.hex : "#f0f0f0",
                }}
              ></div>
              <div className="makeup-color-label">EYE</div>
            </div>
            <div className="makeup-color-item">
              <div
                className="makeup-color-circle"
                style={{
                  backgroundColor: selectedColors.cheek.hex !== "transparent" ? selectedColors.cheek.hex : "#f0f0f0",
                }}
              ></div>
              <div className="makeup-color-label">CHEEK</div>
            </div>
          </div>
          {!started && (
            <button onClick={handleStart} className="photo-start-button">
              시작하기
            </button>
          )}
        </div>
      </Largemain>
    </Background>
  );
};

export default PhotoCapturePage;
