import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import cv from "@techstark/opencv-js"; // OpenCV.js 라이브러리 사용

const MediapipeCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [flash, setFlash] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [paperDetected, setPaperDetected] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      refineFaceLandmarks: true,
    });

    holistic.onResults((results) => {
      // 캔버스에 영상을 그립니다.
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      console.log("Face Landmarks:", results.faceLandmarks);
      console.log("Left Hand:", results.leftHandLandmarks);
      console.log("Right Hand:", results.rightHandLandmarks);

      const faceValid = detectFace(results);
      // results를 전달하여 손 랜드마크를 기반으로 종이 인식 여부 판단
      const paperValid = detectPaper(results);

      setFaceDetected(faceValid);
      setPaperDetected(paperValid);

      if (faceValid && paperValid && !captured) {
        triggerFlashAndCapture();
      }
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
  }, [captured]);

  const detectFace = (results) => {
    if (!results.faceLandmarks) return false;

    const nose = results.faceLandmarks[1];
    const leftEye = results.faceLandmarks[33];
    const rightEye = results.faceLandmarks[263];
    const mouth = results.faceLandmarks[13];

    const isInsideCircle = (point) => {
      const centerX = 0.5,
        centerY = 0.5,
        radius = 0.15;
      const dx = point.x - centerX;
      const dy = point.y - centerY;
      return dx * dx + dy * dy <= radius * radius;
    };

    return (
      nose &&
      leftEye &&
      rightEye &&
      mouth &&
      isInsideCircle(nose) &&
      isInsideCircle(leftEye) &&
      isInsideCircle(rightEye) &&
      isInsideCircle(mouth)
    );
  };

  // 종이 인식 함수 (손 랜드마크 기반)
  // 히트박스 영역: left: 0.62, top: 0.05, width: 0.30, height: 0.70
  const detectPaper = (results) => {
    const hitboxX = 0.62;
    const hitboxY = 0.05;
    const hitboxW = 0.30;
    const hitboxH = 0.70;

    const getHandCenter = (landmarks) => {
      if (!landmarks || landmarks.length === 0) return null;
      let sumX = 0,
        sumY = 0;
      landmarks.forEach((lm) => {
        sumX += lm.x;
        sumY += lm.y;
      });
      // x 좌표 반전 처리 (영상은 scaleX(-1) 적용됨)
      let centerX = sumX / landmarks.length;
      let centerY = sumY / landmarks.length;
      return { x: 1 - centerX, y: centerY };
    };

    let handCenter = null;
    if (results.rightHandLandmarks && results.rightHandLandmarks.length > 0) {
      handCenter = getHandCenter(results.rightHandLandmarks);
    } else if (results.leftHandLandmarks && results.leftHandLandmarks.length > 0) {
      handCenter = getHandCenter(results.leftHandLandmarks);
    }

    if (!handCenter) {
      console.log("손 랜드마크가 없습니다.");
      return false;
    }

    console.log("손 중심 좌표 (반전 후):", handCenter);

    if (
      handCenter.x >= hitboxX &&
      handCenter.x <= hitboxX + hitboxW &&
      handCenter.y >= hitboxY &&
      handCenter.y <= hitboxY + hitboxH
    ) {
      return true;
    }
    return false;
  };

  const triggerFlashAndCapture = () => {
    setFlash(true);
    setTimeout(() => {
      capturePhoto();
      setFlash(false);
      setCaptured(true);
    }, 300);
  };

  // 캡쳐된 사진에서 얼굴 영역과 종이 영역만 잘라내어 백엔드로 전송
  const capturePhoto = () => {
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

      // 전체 캡쳐된 이미지 (데이터 URL)
      const capturedImage = canvas.toDataURL("image/png");
      console.log("Captured Image:", capturedImage);

      // 얼굴 영역 좌표 (노란 동그라미 가이드 영역)
      const faceLeft = video.videoWidth * 0.35;
      const faceTop = video.videoHeight * 0.15;
      const faceWidth = video.videoWidth * 0.30;
      const faceHeight = video.videoHeight * 0.70;

      // 종이 영역 좌표 (노란 네모 가이드 영역)
      const paperLeft = video.videoWidth * 0.70;
      const paperTop = video.videoHeight * 0.20;
      const paperWidth = video.videoWidth * 0.15;
      const paperHeight = video.videoHeight * 0.50;

      // 얼굴 영역 오프스크린 캔버스 생성
      const faceCanvas = document.createElement("canvas");
      faceCanvas.width = faceWidth;
      faceCanvas.height = faceHeight;
      const faceCtx = faceCanvas.getContext("2d");
      faceCtx.drawImage(
        canvas,
        faceLeft,
        faceTop,
        faceWidth,
        faceHeight,
        0,
        0,
        faceWidth,
        faceHeight
      );
      const faceImage = faceCanvas.toDataURL("image/png");

      // 종이 영역 오프스크린 캔버스 생성
      const paperCanvas = document.createElement("canvas");
      paperCanvas.width = paperWidth;
      paperCanvas.height = paperHeight;
      const paperCtx = paperCanvas.getContext("2d");
      paperCtx.drawImage(
        canvas,
        paperLeft,
        paperTop,
        paperWidth,
        paperHeight,
        0,
        0,
        paperWidth,
        paperHeight
      );
      const paperImage = paperCanvas.toDataURL("image/png");

      // 백엔드로 POST 요청 전송 (URL 수정됨)
      fetch("http://localhost:8080/api/colorlab/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          face_image: faceImage,
          a4_image: paperImage,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`서버 응답 상태: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("서버 응답:", data);
          setUploadResponse(data);
        })
        .catch((err) => {
          console.error("에러 발생:", err);
          setUploadResponse({ error: err.toString() });
        });
    }
  };

  return (
    <div style={{ width: "100%", height: "115%", position: "relative", overflow: "hidden" }}>
      {flash && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "white",
            opacity: 0.8,
            transition: "opacity 0.3s",
          }}
        />
      )}
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
      {/* 종이(마커) 인식 가이드 영역: 기존 노란색 네모 */}
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
      {/* 안내 텍스트 */}
      <div
        style={{
          position: "absolute",
          top: "7%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontWeight: "bold",
          fontSize: "24px",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        얼굴을 가이드라인에 맞게 위치시켜 주세요
      </div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px",
          background: "rgba(0, 0, 0, 0.7)",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <p>
          <input type="checkbox" checked={faceDetected} readOnly /> 얼굴 인식
        </p>
        <p>
          <input type="checkbox" checked={paperDetected} readOnly /> 종이 인식
        </p>
        <p>Captured: {captured ? "Yes" : "No"}</p>
        {uploadResponse && (
          <p>
            Upload Response:{" "}
            {uploadResponse.error ? uploadResponse.error : JSON.stringify(uploadResponse)}
          </p>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} willreadfrequently="true" />
    </div>
  );
};

export default MediapipeCamera;
