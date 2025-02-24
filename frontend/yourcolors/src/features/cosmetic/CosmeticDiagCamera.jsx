import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../store/UseStore";
import { useModalStore } from "../../store/useModalStore";
import useWebcamStore from "../../store/useWebcamStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const CosmeticDiagCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [showDiagnoseButton, setShowDiagnoseButton] = useState(false);
  const [showRetakeButton, setShowRetakeButton] = useState(false);

  const navigate = useNavigate();
  const { setResults } = useStore();
  const { openModal } = useModalStore();
  const { stream, startCamera, stopCamera } = useWebcamStore();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
    setCountdown(3); // 3초 카운트다운 시작
    setShowCaptureButton(false);
    setShowRetakeButton(false);

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

  // 노란색 네모 영역(200x300)을 캡처하여 이미지를 생성합니다.
  const capturePhoto = () => {
    const video = videoRef.current;
    if (video) {
      const cropCanvas = document.createElement("canvas");
      const cropWidth = 200;
      const cropHeight = 300;
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext("2d");
      // 노란 네모는 영상의 중앙에서 수평은 정확히 중앙, 수직은 48% 위치가 중심입니다.
      const cropX = (video.videoWidth / 2) - (cropWidth / 2);
      const cropY = (video.videoHeight * 0.48) - (cropHeight / 2);
      cropCtx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      const croppedImageData = cropCanvas.toDataURL("image/png");
      setCapturedImage(croppedImageData);
      setShowDiagnoseButton(true);
      setShowRetakeButton(true);
    }
  };

  // dataURL을 Blob으로 변환하는 헬퍼 함수
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // 캡처한 이미지를 form-data 형식으로 전송하고, 응답 데이터를 모달로 결과 차트 형태로 표시하는 함수
  const sendImageToServer = () => {
    if (!capturedImage) {
      openModal("이미지가 캡쳐되지 않았습니다. 다시 촬영해주세요.");
      return;
    }
    const formData = new FormData();
    const imageBlob = dataURLtoBlob(capturedImage);
    formData.append("lip_image", imageBlob, "image.png");

    axios
      .post(`${apiBaseUrl}/api/cosmetic/lip`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const diagnosis = response.data.diagnosis;
        const sortedDiagnosis = diagnosis.sort((a, b) => a.rank - b.rank);
        openModal(
          <div style={{ padding: "20px" }}>
            <h2>진단 결과</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sortedDiagnosis.map((item, index) => {
                const probabilityNum = parseFloat(item.probability);
                return (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "120px" }}>{item.personal_color}</span>
                    <div
                      style={{
                        height: "20px",
                        backgroundColor: "#82DC28",
                        width: `${probabilityNum * 3}px`,
                      }}
                    />
                    <span style={{ marginLeft: "10px" }}>{item.probability}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
              <span>립 컬러:</span>
              <div
                style={{
                  display: "inline-block",
                  background: response.data.lip_color,
                  width: "50px",
                  height: "50px",
                  marginLeft: "10px",
                }}
              />
            </div>
          </div>
        );
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response status:", error.response.status);
          console.error("Error response data:", error.response.data);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
        console.error("Error sending image to server:", error);
        openModal("진단에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleDiagnose = () => {
    if (capturedImage) {
      sendImageToServer();
    } else {
      openModal("이미지가 캡쳐되지 않았습니다. 다시 촬영해주세요.");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowDiagnoseButton(false);
    setShowCaptureButton(true);
    setShowRetakeButton(false);
    setCountdown(null);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
      {/* Webcam video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Face guideline */}
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "300px",
          border: "8px dashed yellow",
          borderRadius: "0%",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* Alignment guidance text */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "8px 12px",
          borderRadius: "8px",
        }}
      >
        화장품을 가이드라인에 맞춰주세요
      </div>

      {/* Captured image */}
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured"
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", position: "absolute" }}
        />
      )}

      {/* Countdown display */}
      {countdown !== null && (
        <div
          style={{
            position: "absolute",
            bottom: "45%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "50px",
            fontWeight: "bold",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "12px 12px",
            borderRadius: "8px",
          }}
        >
          {countdown}
        </div>
      )}

      {/* Capture button */}
      {showCaptureButton && (
        <button
          onClick={handleCapture}
          disabled={!showCaptureButton}
          style={{
            position: "absolute",
            bottom: "11%",
            backgroundColor: "#82DC28",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: showCaptureButton ? "pointer" : "not-allowed",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          촬영하기
        </button>
      )}

      {/* Retake button */}
      {showRetakeButton && (
        <button
          onClick={handleRetake}
          style={{
            position: "absolute",
            bottom: "11%",
            backgroundColor: "#82DC28",
            left: "40%",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          다시 촬영하기
        </button>
      )}

      {/* Diagnose button */}
      {showDiagnoseButton && (
        <button
          onClick={handleDiagnose}
          style={{
            position: "absolute",
            bottom: "11%",
            left: "60%",
            transform: "translateX(-50%)",
            backgroundColor: "#82DC28",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          진단하기
        </button>
      )}
    </div>
  );
};

export default CosmeticDiagCamera;
