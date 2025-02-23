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
    }
  };

  const extractColor = (canvas) => {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(100, 100, 50, 50);
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
    sendColorToServer(color);
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

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} 
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {capturedImage && (
        <img 
          src={capturedImage} 
          alt="Captured" 
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} 
        />
      )}
      {extractedColor && <div style={{ background: extractedColor, width: "50px", height: "50px" }}></div>}
    </div>
  );
  
};

export default CosmeticDiagnosis;