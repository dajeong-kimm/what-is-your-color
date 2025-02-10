import React, { useEffect, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import "@mediapipe/tasks-vision";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import '../makeup/MakeupCamera.css';

const MakeupCamera = ({ className }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const setupFaceLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

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
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

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

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];

      const fillRegion = (indices, color) => {
        if (indices.length === 0) return;

        ctx.beginPath();
        const firstPoint = landmarks[indices[0]];
        ctx.moveTo((1 - firstPoint.x) * canvas.width, firstPoint.y * canvas.height);

        for (let i = 1; i < indices.length - 1; i++) {
          const p1 = landmarks[indices[i]];
          const p2 = landmarks[indices[i + 1]];
          const cpX = (1 - p1.x) * canvas.width;
          const cpY = p1.y * canvas.height;
          const endX = (1 - p2.x) * canvas.width;
          const endY = p2.y * canvas.height;
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        }

        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      //왼쪽 눈
      fillRegion([33, 130, 226, 247, 30, 29, 27, 28, 56, 190, 243, 133, 173, 157, 158, 159, 160, 161, 246], "rgba(0, 0, 255, 0.3)");
      //오른쪽 눈
      fillRegion([463, 414, 286, 258, 257, 259, 260, 467, 446, 359, 263, 466, 388, 387, 386, 385, 384, 398, 362], "rgba(0, 0, 255, 0.3)");
      //윗입술
      fillRegion([61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 306, 292, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 62, 76], "rgba(255, 0, 0, 0.5)");
      //아랫입술
      fillRegion([61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 306, 292, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 62, 76, 61], "rgba(255, 0, 0, 0.5)");
      // 왼쪽 볼
      fillRegion([117, 123, 187, 205, 101, 118, 117], "rgba(255, 182, 193, 0.3)");
      // 오른쪽 볼
      fillRegion([411, 352, 346, 347, 330, 425, 411], "rgba(255, 182, 193, 0.3)");
    }

    animationFrameRef.current = requestAnimationFrame(detectFaces);
  };

  return (
    <div className={`camera ${className}`}>
      <video ref={videoRef} autoPlay playsInline className="camera-video" style={{ display: "none" }} />
      <canvas ref={canvasRef} className="camera-overlay"></canvas>
    </div>
  );
};

export default MakeupCamera;