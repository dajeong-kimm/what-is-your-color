import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../store/UseStore"; // Zustand 상태관리 데이터
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

let cameraInstance = null; // 카메라 중복 실행 방지용 (전역 변수)

const MediapipeCameraXTimer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null); // Holistic 인스턴스 저장용

  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false); // 중복 촬영 방지

  const navigate = useNavigate();
  const { setUserPersonalId, userImageFile, setUserImageFile, setResults, setGptSummary } = useStore();

  useEffect(() => {
    console.log("[useEffect] Component mounted -> Initialize camera");
    initializeCamera();

    // cleanup: 컴포넌트 언마운트 시 모든 인스턴스와 스트림 해제
    return () => {
      console.log("[useEffect cleanup] Stopping camera and releasing instances");
      
      // Camera 인스턴스 정지 (stop() 메서드가 존재하면 호출)
      if (cameraInstance && typeof cameraInstance.stop === "function") {
        cameraInstance.stop();
      }
      cameraInstance = null;

      // Holistic 인스턴스 해제
      if (holisticRef.current) {
        holisticRef.current.close();
        holisticRef.current = null;
      }

      // video 스트림 정리
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const initializeCamera = () => {
    console.log("[initializeCamera] called");
    // Holistic 인스턴스 생성 후 ref에 저장
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });
    holisticRef.current = holistic;

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      refineFaceLandmarks: true,
    });

    holistic.onResults(() => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

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
      console.log("[initializeCamera] Setup camera instance");
      cameraInstance = new Camera(videoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      cameraInstance.start();
    }
  };

  const handleCapture = async () => {
    // 버튼 중복 클릭 방지
    setShowCaptureButton(false);

    console.log("[handleCapture] Start 5s countdown");
    setCapturedImage(null);
    setHasCaptured(false);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          console.log("[handleCapture] Time is up -> capturePhoto()");
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (hasCaptured) {
      console.log("[capturePhoto] Already captured -> skip");
      return;
    }
    setHasCaptured(true); // 중복 촬영 방지

    console.log("[capturePhoto] Capturing now...");
    setIsFlashing(true);

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

        // 전체 캡처한 이미지
        const imageData = canvas.toDataURL("image/png");
        console.log("Captured Image (base64):", imageData);

        setCapturedImage(imageData);
        setCountdown(null);

        // 얼굴 부분 추출
        const faceImage = extractFaceImage(canvas);
        console.log("Extracted Face Image (base64):", faceImage);

        // Base64 → Blob 변환
        const blob = base64ToBlob(faceImage, "image/png");

        // FormData 객체 생성
        const formData = new FormData();
        formData.append("face_image", blob, "captured_face.png");
        formData.append("a4_image", "");
        setUserImageFile(formData);

        console.log("색상거리(종이X) - 얼굴 이미지 form-data로 저장 완료!!!!");
        formData.forEach((value, key) => {
          console.log(`Key: ${key}, Value:`, value);
        });

        // sendImagesToServer(faceImage); // 호출 시점 조정
      }
    }, 300);
  };

  const extractFaceImage = (canvas) => {
    console.log("[extractFaceImage] Called");
    const faceCanvas = document.createElement("canvas");
    const context = faceCanvas.getContext("2d");

    const faceX = canvas.width * 0.35;
    const faceY = canvas.height * 0.28;
    const faceWidth = canvas.width * 0.3;
    const faceHeight = canvas.height * 0.46;

    faceCanvas.width = faceWidth;
    faceCanvas.height = faceHeight;

    context.drawImage(
      canvas,
      faceX,
      faceY,
      faceWidth,
      faceHeight,
      0,
      0,
      faceWidth,
      faceHeight
    );
    return faceCanvas.toDataURL("image/png");
  };

  // Base64 -> Blob 변환 함수
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const sendImagesToServer = (formData) => {
    console.log("[sendImagesToServer] Sending to server...");
    console.log("11. 색상 거리 사용 API");

    axios
      .post(`${apiBaseUrl}/api/consult/dist`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Server Response(색상거리 종이없음):", response.data);
        console.log("너의 색깔은?? : ", response.data.results[0].personal_id);
        setUserPersonalId(response.data.results[0].personal_id);
        setResults(response.data.results);
        setGptSummary(response.data.gpt_summary);
      })
      .catch((error) => {
        console.error("Error sending images to server:", error);
        alert("퍼스널컬러 진단에 실패했습니다. 화면에 맞춰서 다시 시도해주세요.");
        navigate(-1);
      });
  };

  const handleRetake = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        width: "100%",
        height: "115%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 촬영 시 화면 깜빡임 */}
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

      {/* 5초 카운트다운 */}
      {countdown !== null && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "4rem",
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

      {capturedImage ? (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              padding: "0 5%",
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
                transform: "translateX(-65%)",
              }}
            >
              다시 촬영하기
            </button>
            <button
              onClick={() => {
                if (userImageFile) {
                  setResults([]);
                  setGptSummary("");
                  sendImagesToServer(userImageFile);
                  navigate("/LoadingPage", {
                    state: { from: "MediapipeCameraXTimer" },
                  });
                }
              }}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
                backgroundColor: "#82DC28",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transform: "translateX(-15%)",
              }}
            >
              진단하기
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
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            willreadfrequently="true"
          />
          {/* 얼굴 인식 가이드 영역 */}
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
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            얼굴을 가이드라인에 맞게 위치시켜 주세요.
          </div>

          {showCaptureButton && (
            <div
              style={{
                position: "absolute",
                bottom: "40%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
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

export default MediapipeCameraXTimer;
