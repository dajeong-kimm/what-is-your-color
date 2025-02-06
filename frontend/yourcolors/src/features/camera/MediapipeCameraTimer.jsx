import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../button/loadingpage/LoadingPage";

const MediapipeCameraTimer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false); // 촬영 애니메이션 효과
  const navigate = useNavigate();

  useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = () => {
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      refineFaceLandmarks: true,
    });

    holistic.onResults(() => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  };

  /** 📌 촬영 버튼 클릭 시 5초 카운트다운 후 사진 촬영 */
  const handleCapture = async () => {
    setCapturedImage(null);
    setCountdown(5);
    setShowCaptureButton(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /** 📌 사진 촬영 후 캡처한 이미지 저장 */
  const capturePhoto = () => {
    setIsFlashing(true); // 📸 촬영 애니메이션 활성화

    setTimeout(() => {
      setIsFlashing(false);
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video) {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        setCountdown(null);
      }
    }, 300); // 촬영 애니메이션 지속시간
  };

  /** 📌 다시 촬영하기 버튼 클릭 시 페이지 새로고침 */
  const handleRetake = () => {
    window.location.reload(); // 🔄 페이지 새로고침
  };

  return (
    <div style={{ width: "100%", height: "115%", position: "relative", overflow: "hidden" }}>
      {/* 📸 촬영 애니메이션 (화면 깜빡임) */}
      {isFlashing && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            opacity: 0.8,
            transition: "opacity 0.3s",
            zIndex: 20,
          }}
        />
      )}

      {/* 📌 5초 카운트다운 화면 */}
      {countdown !== null && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "6rem",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "1.5rem 3rem",
            borderRadius: "15px",
            zIndex: 10,
          }}
        >
          {countdown}
        </div>
      )}

      {/* 📌 촬영된 이미지 표시 */}
      {capturedImage ? (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
                    {/* 📌 버튼 영역 */}
                    <div 
            style={{ 
              position: "absolute", 
              bottom: "5%", 
              width: "100%", 
              display: "flex", 
              justifyContent: "center",  /* 버튼을 중앙 정렬 */
              gap: "40px",  /* 버튼 간 간격 조정 */
              padding: "0 5%" 
            }}
          >
            <button
              onClick={handleRetake}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
                backgroundColor: "#82DC28",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transform: "translateX(-65%)", // 📌 버튼을 왼쪽으로 이동

              }}
            >
              다시 촬영하기
            </button>
            <button
              onClick={() => navigate("/LoadingPage")}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
                backgroundColor: "#82DC28",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transform: "translateX(-15%)", // 📌 버튼을 더 왼쪽으로 이동
              }}
            >
              다음으로
            </button>
          </div>

        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} willreadfrequently="true" />

          {/* 📌 얼굴 인식 가이드 영역 */}
          <div
            style={{
              position: "absolute",
              border: "8px dashed yellow",
              width: "30%",
              height: "70%",
              top: "15%",
              left: "35%",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          {/* 📌 종이 인식 가이드 영역 */}
          <div
            style={{
              position: "absolute",
              border: "6px dashed yellow",
              width: "15%",
              height: "50%",
              top: "20%",
              left: "70%",
              pointerEvents: "none",
            }}
          />
          {/* 📌 안내 텍스트 */}
          <div
            style={{
              position: "absolute",
              top: "1%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            얼굴을 가이드라인에 맞게 위치시키고, <br />
            네모 영역에 맞추어 종이를 들어주세요.
          </div>

          {/* 📌 촬영하기 버튼 */}
          {showCaptureButton && (
            <div style={{ position: "absolute", bottom: "40%", left: "50%", transform: "translateX(-50%)" }}>
              <button
                onClick={handleCapture}
                style={{
                  padding: "1.2rem 2.5rem",
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  backgroundColor: "#82DC28",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                촬영하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MediapipeCameraTimer;
