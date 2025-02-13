import React, { useEffect, useRef } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import useStore from "../../store/UseStore";
import "../makeup/MakeupCamera.css";

const MakeupCamera = ({ cam, eyeShadowColor, blushColor, lipColor, category }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  console.log("MakeupCamera - props:", { eyeShadowColor, blushColor, lipColor, category });

  useEffect(() => {
    const setupFaceLandmarker = async () => {
      console.log("MakeupCamera: Setting up FaceLandmarker...");
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        console.log("MakeupCamera: Vision tasks loaded:", vision);
        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
        console.log("MakeupCamera: FaceLandmarker instance created:", faceLandmarker);
        faceLandmarkerRef.current = faceLandmarker;
      } catch (error) {
        console.error("MakeupCamera: Error setting up FaceLandmarker:", error);
      }
    };

    const startCamera = async () => {
      try {
        console.log("MakeupCamera: Requesting user media...");
        if (videoRef.current) {
          const currentStream = videoRef.current.srcObject;
          if (currentStream) {
            console.log("MakeupCamera: Existing stream found, stopping tracks...");
            currentStream.getTracks().forEach((track) => track.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          console.log("MakeupCamera: User media stream obtained:", stream);
          videoRef.current.srcObject = stream;
          videoRef.current.load();
          setTimeout(() => {
            videoRef.current
              .play()
              .then(() => console.log("MakeupCamera: Video playback started."))
              .catch((error) => console.error("MakeupCamera: Play error:", error));
          }, 500);
          detectFaces();
        }
      } catch (error) {
        console.error("MakeupCamera: Camera access error:", error);
      }
    };

    (async () => {
      await setupFaceLandmarker();
      await startCamera();
    })();

    return () => {
      console.log("MakeupCamera: Cleaning up...");
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        console.log("MakeupCamera: Stopped all video tracks.");
      }
    };
  }, []);

  // 색상값이 변경될 때마다 얼굴 감지 및 메이크업 적용 재실행
  useEffect(() => {
    console.log("MakeupCamera: Color props updated. Re-detecting faces.");
    if (canvasRef.current) {
      detectFaces();
    }
  }, [eyeShadowColor, blushColor, lipColor]);

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
    console.log("MakeupCamera: Face detection results:", results);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];
      console.log("MakeupCamera: Detected landmarks:", landmarks);
      // 추가 메이크업 효과 적용 함수 호출 가능
    }
    animationFrameRef.current = requestAnimationFrame(detectFaces);
  };

  return (
    <div className={`camera ${cam}`}>
      <video ref={videoRef} autoPlay playsInline className="camera-video" style={{ display: "none" }} />
      <canvas ref={canvasRef} className="camera-overlay"></canvas>
    </div>
  );
};

export default MakeupCamera;
