import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import cv from "@techstark/opencv-js";

const MediapipeCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [flash, setFlash] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  // 종이 인식 관련 상태 제거: paperDetected
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
      setFaceDetected(faceValid);

      // 종이 인식은 제거되어 얼굴 인식만으로 촬영함
      if (faceValid && !captured) {
        triggerFlashAndCapture();
      }
    });
    let camera;
    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      // 카메라 인스턴스 종료 (stop() 메서드가 있다면 호출)
      if (camera && typeof camera.stop === "function") {
        camera.stop();
      }
      // video 스트림 종료: srcObject에 있는 모든 트랙 정지
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      // Holistic 인스턴스 종료
      if (holistic && typeof holistic.close === "function") {
        holistic.close();
      }
    };
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

  const triggerFlashAndCapture = () => {
    setFlash(true);
    setTimeout(() => {
      capturePhoto();
      setFlash(false);
      setCaptured(true);
    }, 300);
  };

  // 캡쳐된 사진에서 얼굴 영역(노란 동그라미 가이드 영역)만 잘라내어 백엔드로 전송
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

      // POST 요청 전송: a4_image는 빈 문자열로 전송
      fetch("http://localhost:8080/api/colorlab/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          face_image: faceImage,
          a4_image: ""
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
      {/* 얼굴 인식 가이드 영역 (노란 동그라미) */}
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
        <p>Captured: {captured ? "Yes" : "No"}</p>
        {uploadResponse && (
          <p>
            Upload Response:{" "}
            {uploadResponse.error
              ? uploadResponse.error
              : JSON.stringify(uploadResponse)}
          </p>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} willreadfrequently="true" />
    </div>
  );
};

export default MediapipeCamera;
