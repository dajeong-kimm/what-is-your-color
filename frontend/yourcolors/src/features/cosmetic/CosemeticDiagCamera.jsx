import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../store/UseStore";
import { useModalStore } from "../../store/useModalStore";
import useWebcamStore from "../../store/useWebcamStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const CosmeticDiagnosis = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedColor, setExtractedColor] = useState(null);
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
    setCountdown(3); // Start countdown at 3 seconds
    setShowCaptureButton(false); // Disable button
    setShowRetakeButton(false); // Hide retake button

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

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      extractColor(canvas);
      setShowDiagnoseButton(true); // Show Diagnose button after capture
      setShowRetakeButton(true); // Show Retake button after capture
    }
  };

  const extractColor = (canvas) => {
    const context = canvas.getContext("2d");
    const rectWidth = 50; // Color extraction area width
    const rectHeight = 50; // Color extraction area height

    const centerX = (canvas.width / 2) - (rectWidth / 2); // Central X coordinate
    const centerY = (canvas.height / 2) - (rectHeight / 2); // Central Y coordinate

    const imageData = context.getImageData(centerX, centerY, rectWidth, rectHeight);
    const data = imageData.data;
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    const pixelCount = data.length / 4;
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);
    const color = `rgb(${r}, ${g}, ${b})`;
    setExtractedColor(color);
  };

  const sendColorToServer = (color) => {
    axios
      .post(`${apiBaseUrl}/api/cosmetic/lip`, { color })
      .then((response) => {
        setResults(response.data.results);
        navigate("/DiagnosisResult", { state: { results: response.data.results } });
      })
      .catch((error) => {
        console.error("Error sending color to server:", error);
        openModal("진단에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleDiagnose = () => {
    if (extractedColor) {
      sendColorToServer(extractedColor);
    } else {
      openModal("색상이 추출되지 않았습니다. 다시 촬영해주세요.");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedColor(null);
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

      {/* Extracted color */}
      {extractedColor && <div style={{ background: extractedColor, width: "50px", height: "50px", position: "absolute", bottom: "10%", left: "10%" }}></div>}

      {/* Countdown display */}
      {countdown !== null && (
        <div style={{
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
        }}>
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
            bottom: "12%",
            backgroundColor: "#82DC28",
            left : "40%",
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
        //   onClick={handleDiagnose}
          onClick={() => {
            if (extractedColor) { // Use the extractedColor from the CosmeticDiagnosis component
              setResults([]); // Clear previous results
              setGptSummary(""); // Clear the summary
              sendColorToServer(extractedColor); // Send the extracted color to the server
              navigate("/LoadingPage", {
                state: { from: "CosmeticDiagnosis" }, // Indicate where the navigation is coming from
              });
            } else {
              openModal("색상이 추출되지 않았습니다. 다시 촬영해주세요."); // Notify user to retake if no color is extracted
            }
          }}
          
          style={{
            position: "absolute",
            bottom: "12%",
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

export default CosmeticDiagnosis;
