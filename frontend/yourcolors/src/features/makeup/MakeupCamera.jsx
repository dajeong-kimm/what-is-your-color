import React, { useEffect, useRef } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import useStore from "../../store/UseStore";
import "../makeup/MakeupCamera.css";

const MakeupCamera = ({ cam, eyeShadowColor, blushColor, lipColor, category}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  // const lipColor = useRef(null);

    console.log(eyeShadowColor)
    console.log(category)
    console.log(lipColor)
    console.log(blushColor)



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

    //   const drawBlushGradient = (indices, color, radius) => {
    //     if (!indices.length) return;
    
    //     ctx.save();
    
    //     // 선택된 점들의 평균 좌표로 blush의 중심 계산
    //     let centerX = 0, centerY = 0;
    //     indices.forEach(idx => {
    //         centerX += (1 - landmarks[idx].x) * canvas.width;
    //         centerY += landmarks[idx].y * canvas.height;
    //     });
    //     centerX /= indices.length;
    //     centerY /= indices.length;
    
    //     // 방사형 그라데이션 생성
    //     // 중심에서 바깥쪽으로 갈수록 점진적으로 투명해지도록 알파 값을 낮춤
    //     const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    //     gradient.addColorStop(0, color.replace(/[\d.]+\)$/, "0.4)"));  // 중심: 약 40% opacity
    //     gradient.addColorStop(0.3, color.replace(/[\d.]+\)$/, "0.25)")); // 중간: 약 25% opacity
    //     gradient.addColorStop(0.6, color.replace(/[\d.]+\)$/, "0.1)"));  // 외곽 근처: 약 10% opacity
    //     gradient.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));       // 가장자리: 완전 투명
    
    //     // 그림자 효과 추가 (자연스러운 블러 효과)
    //     ctx.shadowColor = color.replace(/[\d.]+\)$/, "0.1)"); // 그림자도 더 투명하게
    //     ctx.shadowBlur = 20;
    
    //     // 전체적인 투명도 조절 (더 낮은 값으로 설정)
    //     ctx.fillStyle = gradient;
    //     ctx.globalAlpha = 0.35; 
    
    //     // 불규칙한 경계를 만들기 위해 단순한 원 대신 다각형을 사용
    //     ctx.beginPath();
    //     const segments = 32;  // 분할 수가 많을수록 경계가 부드러워짐
    //     for (let i = 0; i < segments; i++) {
    //         const angle = (i / segments) * Math.PI * 2;
    //         // 반지름에 약 ±10% 무작위 변화를 주어 자연스러운 윤곽 생성
    //         const randomFactor = 0.9 + Math.random() * 0.2;
    //         const curRadius = radius * randomFactor;
    //         const x = centerX + curRadius * Math.cos(angle);
    //         const y = centerY + curRadius * Math.sin(angle);
    //         if (i === 0) {
    //             ctx.moveTo(x, y);
    //         } else {
    //             ctx.lineTo(x, y);
    //         }
    //     }
    //     ctx.closePath();
    //     ctx.fill();
    
    //     // 원래의 설정 복원
    //     ctx.shadowBlur = 0;
    //     ctx.globalAlpha = 1;
    //     ctx.restore();
    // };
    
    

    
      

      // 치크 (볼터치)
      const drawBlushGradient = (indices, color, radius) => {
        if (!indices.length || color === "transparent") return; // 투명 색상이면 적용 안 함
      
        ctx.save();
      
        // 중심 좌표 계산 (선택된 점들의 평균)
        let centerX = 0, centerY = 0;
        indices.forEach(idx => {
          centerX += (1 - landmarks[idx].x) * canvas.width;
          centerY += landmarks[idx].y * canvas.height;
        });
        centerX /= indices.length;
        centerY /= indices.length;
      
        // 부드러운 블러 효과를 위한 그라디언트 생성
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, color.replace(/[\d.]+\)$/, "1)")); // 중심부 (더 투명)
        gradient.addColorStop(0.3, color.replace(/[\d.]+\)$/, "0.9)")); // 중간 (연한 색상)
        gradient.addColorStop(0.7, color.replace(/[\d.]+\)$/, "0.2)")); // 외곽 (거의 투명)
        gradient.addColorStop(1, color.replace(/[\d.]+\)$/, "0)")); // 가장자리 완전 투명
      
        // 그림자 효과 추가 (더 부드러운 블러 효과)
        ctx.shadowColor = color.replace(/[\d.]+\)$/, "0.4)"); // 그림자 효과
        ctx.shadowBlur = 100; // 기존보다 더 퍼지게 적용
      
        // 채우기 설정 (부드러운 블렌딩)
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.85; // 기존보다 더 투명하게 조절
        ctx.globalCompositeOperation = "soft-light"; // 피부와 자연스럽게 섞이도록 설정
        // ctx.globalCompositeOperation = "overlay";  // 피부와 자연스럽게 섞이도록 설정
        // ctx.globalCompositeOperation = "multiply";  // 피부와 자연스럽게 섞이도록 설정
      
        // 단일 볼터치 적용
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
        ctx.fill();
      
        // 원래 설정 복원
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.restore();
      };
      
      
    

      // 입술 윤곽
      const UPPER_LIP = [61,185,40,39,37,0,267,269,270,409,291,306,292,308,415,310,311,312,13,82,81,80,191,78,62,76];
      const LOWER_LIP = [61,146,91,181,84,17,314,405,321,375,291,306,292,308,324,318,402,317,14,87,178,88,95,78,62,76,61];
      // const UPPER_LIP = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14];
      // const LOWER_LIP = [87, 178, 88, 95, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311, 312, 13];

      // 입술 라인 블렌딩 처리
      drawSmoothRegion(UPPER_LIP, lipColor ||"rgba(0,0,0,0)", 25);
      drawSmoothRegion(LOWER_LIP, lipColor || "rgba(0,0,0,0)", 25);

      // 아이섀도우 - 양쪽 눈 적용
      const LEFT_EYE_SHADOW = [33, 130, 226, 247, 30, 29, 27, 28, 56, 190, 243, 133, 173, 157, 158, 159, 160, 161, 246];
      const RIGHT_EYE_SHADOW = [263, 359, 446, 467, 260, 259, 257, 258, 286, 414, 463, 353, 383, 362, 398, 384, 385, 386, 466];

      // 양쪽 눈에 적용
      drawSmoothRegion(LEFT_EYE_SHADOW, eyeShadowColor || "rgba(0,0,0,0)", 15);
      drawSmoothRegion(RIGHT_EYE_SHADOW, eyeShadowColor || "rgba(0,0,0,0)", 15);

      // drawBlushGradient([117, 123, 187, 205, 101, 118, 117], blushColor || "rgba(0, 0, 0, 0)", 35);
      drawBlushGradient([117, 123, 185, 203, 101, 118, 117], blushColor || "rgba(0, 0, 0, 0)", 20);
      drawBlushGradient([411, 352, 346, 347, 330, 425, 411], blushColor || "rgba(0, 0, 0, 0)", 20);
    
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
