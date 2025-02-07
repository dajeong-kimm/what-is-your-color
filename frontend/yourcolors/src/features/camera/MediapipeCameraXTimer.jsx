import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MediapipeCameraXTimer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
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

  const capturePhoto = () => {
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

        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        setCountdown(null);

        const faceImage = extractFaceImage(canvas);

        sendImagesToServer(faceImage);
      }
    }, 300);
  };

  const extractFaceImage = (canvas) => {
    const faceCanvas = document.createElement("canvas");
    const context = faceCanvas.getContext("2d");
    const size = Math.min(canvas.width, canvas.height) * 0.3;
    faceCanvas.width = size;
    faceCanvas.height = size;
    context.drawImage(
      canvas,
      canvas.width * 0.35,
      canvas.height * 0.15,
      size,
      size,
      0,
      0,
      size,
      size
    );
    return faceCanvas.toDataURL("image/png");
  };

  const sendImagesToServer = (faceImage) => {
    axios
      .post("http://localhost:9000/api/colorlab/ai-model", {
        face_image: faceImage || "",
        a4_image: "", // 빈 문자열 전송
      })
      .then((response) => {
        console.log("Server Response:", response.data);
      })
      .catch((error) => {
        console.error("Error sending images to server:", error);
      });
  };

  const handleRetake = () => {
    window.location.reload();
  };

  return (
    <div style={{ width: "100%", height: "115%", position: "relative", overflow: "hidden" }}>
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
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                transform: "translateX(-15%)",
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

export default MediapipeCameraXTimer;
