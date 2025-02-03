import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const getWebcam = (callback) => {
  try {
    const constraints = { video: true, audio: false };
    navigator.mediaDevices.getUserMedia(constraints).then(callback);
  } catch (err) {
    console.log(err);
  }
};

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(5); // 카운트다운 초기값
  const [transition, setTransition] = useState(false); // 페이드 아웃 제어 상태
  const [flash, setFlash] = useState(false); // 플래시 효과 상태

  useEffect(() => {
    getWebcam((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        startPreview();
      }
    });

    let countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          triggerFlashAndCapture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

 // ✅ 미리보기 영상 캡처 (좌우 반전 적용)
  const startPreview = () => {
    if (previewCanvasRef.current && videoRef.current) {
      const canvas = previewCanvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = 150;
      canvas.height = 100;

      const drawFrame = () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          context.save(); // 현재 상태 저장
          context.scale(-1, 1); // 좌우 반전 적용
          context.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
          context.restore(); // 원래 상태로 복구
        }
        requestAnimationFrame(drawFrame);
      };

      drawFrame();
    }
  };

  

  // 사진 촬영 트리거
  const triggerFlashAndCapture = () => {
    setFlash(true);
    setTimeout(() => {
      capturePhoto();
      setFlash(false);
    }, 300);
  };

  // 사진 촬영 함수// ✅ 사진 촬영 (좌우 반전 적용)
  const capturePhoto = () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;

  if (canvas && video) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.save(); // 현재 상태 저장
    context.scale(-1, 1); // 좌우 반전 적용
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore(); // 원래 상태로 복구

    const capturedImage = canvas.toDataURL('image/png');
    setTransition(true); // 페이드 아웃 시작

    setTimeout(() => {
      navigate('/diagpage2', { state: { capturedImage } });
    }, 1000);
  }
};

  return (
    <div
      style={{
        width: '100%',
        height: '115%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'opacity 1s ease-in-out',
        opacity: transition ? 0 : 1,
        transform: transition ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {/* 플래시 효과 */}
      {flash && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'white',
            opacity: 0.8,
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* 카메라 화면 (좌우 반전 적용) */}
      <video
        ref={videoRef}
        autoPlay
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)', // ✅ 좌우 반전 추가
        }}
      />

      {/* 얼굴 가이드라인 */}
      <div
        style={{
          position: 'absolute',
          border: '8px dashed yellow',
          width: '30%',
          height: '70%',
          top: '15%',
          left: '35%',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

        {/* A4 가이드 박스 (노란색 네모) */}
      <div
        style={{
          position: 'absolute',
          border: '6px dashed yellow',
          width: '15%',
          height: '40%',
          top: '30%',
          left: '70%',
          pointerEvents: 'none',
        }}
      />

      {/* 안내 문구 */}
      <div
        style={{
          position: 'absolute',
          top: '7%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        얼굴을 가이드라인에 맞게 위치시켜 주세요
      </div>

      {/* 캡처된 미리보기 화면 */}
      <canvas
        ref={previewCanvasRef}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '250px',
          height: '150px',
          border: '2px solid white',
        }}
      />

      {/* 카운트다운 표시 */}
      {countdown > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '48%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '64px',
            fontWeight: 'bold',
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '15px 30px',
            borderRadius: '15px',
            pointerEvents: 'none',
            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
            opacity: countdown > 0 ? 1 : 0,
            transform: countdown > 0 ? 'scale(1)' : 'scale(0.8)',
          }}
        >
          {countdown}
        </div>
      )}


      {/* 캡처용 캔버스 (숨김) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;
