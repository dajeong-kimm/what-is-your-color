import React, { useEffect, useRef } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import "../makeup/MakeupCamera.css";

const MakeupCamera = ({ cam, eyeShadowColor, blushColor, lipColor }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // 콘솔로 색상값 확인
  console.log("lipColor:", lipColor);
  console.log("eyeShadowColor:", eyeShadowColor);
  console.log("blushColor:", blushColor);

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
        if (videoRef.current) {
          const currentStream = videoRef.current.srcObject;
          if (currentStream) {
            currentStream.getTracks().forEach((track) => track.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;

          videoRef.current.load();
          setTimeout(() => {
            videoRef.current.play().catch((error) => console.error("Play 오류:", error));
          }, 500);

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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 🎨 색상 값이 변경될 때마다 다시 그리기
useEffect(() => {
  if (canvasRef.current) {
    detectFaces(); // 색상이 변경될 때마다 얼굴을 다시 감지하고 메이크업을 적용
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];

      const drawSmoothRegion = (indices, color, blur = 10) => {
        if (indices.length === 0) return;

        ctx.beginPath();
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.globalAlpha = 0.6; // 투명도 조절 (경계를 부드럽게)

        // 첫 번째 점 이동
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

        // 자연스러운 블렌딩 모드 사용
        ctx.fillStyle = color;
        ctx.globalCompositeOperation = "overlay";
        ctx.fill();

        // 블러 효과 강화
        ctx.filter = `blur(${blur}px)`;
        ctx.globalCompositeOperation = "soft-light";
        ctx.fill();

        // 원래대로 복구
        ctx.filter = "none";
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      };

      // // 치크 (볼터치)
      const drawBlushGradient = (indices, color, radius) => {
        if (!indices.length || color === "rgba(0, 0, 0, 0)") return; // color가 "rgba(0, 0, 0, 0)"이면 종료
        
        ctx.save();
        
        // 중심 좌표 계산 (선택된 점들의 평균)
        let centerX = 0, centerY = 0;
        indices.forEach(idx => {
            centerX += (1 - landmarks[idx].x) * canvas.width;
            centerY += landmarks[idx].y * canvas.height;
        });
        centerX /= indices.length;
        centerY /= indices.length;
        
        // 좌우 대칭 계산
        const mirroredCenterX = canvas.width - centerX; // 반사된 X 좌표 계산
        
        // 부드러운 블러 효과를 위한 그라디언트 생성
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, color.replace(/[\d.]+\)$/, "0.6)")); // 중심부 색상 (진함)
        gradient.addColorStop(0.3, color.replace(/[\d.]+\)$/, "0.3)")); // 중간 영역 (연해짐)
        gradient.addColorStop(0.8, color.replace(/[\d.]+\)$/, "0.1)")); // 외곽 (거의 투명)
        gradient.addColorStop(1, color.replace(/[\d.]+\)$/, "0)")); // 가장자리 투명
        
        // 그림자 효과 추가 (자연스러운 경계 표현)
        ctx.shadowColor = color.replace(/[\d.]+\)$/, "0.2)"); // 연한 그림자
        ctx.shadowBlur = 20; // 더 부드러운 블러 효과 적용
        
        // 그라디언트 채우기
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.8; // 전체 투명도 조절
        
        // 원형 블러 효과 적용 (좌측)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
        ctx.fill();
        
        // 원형 블러 효과 적용 (우측 - 좌우 대칭)
        ctx.beginPath();
        ctx.arc(mirroredCenterX, centerY, radius, 0, Math.PI * 2, false);
        ctx.fill();
        
        // 원래 설정 복원
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
    };
    

      // 입술 윤곽
      const UPPER_LIP = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14];
      const LOWER_LIP = [87, 178, 88, 95, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311, 312, 13];

      // 입술 라인 블렌딩 처리
      drawSmoothRegion(UPPER_LIP, lipColor ||"rgba(0,0,0,0)", 25);
      drawSmoothRegion(LOWER_LIP, lipColor || "rgba(0,0,0,0)", 25);

      // 아이섀도우 - 양쪽 눈 적용
      const LEFT_EYE_SHADOW = [33, 130, 226, 247, 30, 29, 27, 28, 56, 190, 243, 133, 173, 157, 158, 159, 160, 161, 246];
      const RIGHT_EYE_SHADOW = [263, 359, 446, 467, 260, 259, 257, 258, 286, 414, 463, 353, 383, 362, 398, 384, 385, 386, 466];

      // 양쪽 눈에 적용
      drawSmoothRegion(LEFT_EYE_SHADOW, eyeShadowColor || "rgba(0,0,0,0)", 15);
      drawSmoothRegion(RIGHT_EYE_SHADOW, eyeShadowColor || "rgba(0,0,0,0)", 15);

      // drawSmoothRegion([117, 123, 187, 205, 101, 118, 117], blushColor || "rgba(0, 0, 0, 0)", 35);
      // drawSmoothRegion([117, 123, 187, 205, 101, 118, 117], blushColor || "rgba(0, 0, 0, 0)", 35);

      drawBlushGradient([117, 123, 187, 205, 101, 118, 117], blushColor || "rgba(0, 0, 0, 0)", 35);
      drawBlushGradient([117, 123, 187, 205, 101, 118, 117], blushColor || "rgba(0, 0, 0, 0)", 35);

      
      // drawBlushGradient([117, 123, 187, 205, 101, 118, 117],"rgba(0, 0, 0, 0)", 35);
    
    // 기존 볼터치 영역에 자연스러운 그라데이션 블러셔 적용 (좌우 대칭 추가됨)
    // drawBlushGradient([117, 123, 187, 205, 101, 118, 117], blushColor || "rgba(220, 119, 119, 0.8)", 35);
    // drawBlushGradient([411, 352, 346, 347, 330, 425, 411], blushColor || "rgba(220, 119, 119, 0.8)", 35);
    
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
