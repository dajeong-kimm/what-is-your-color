// PhotoCapturePage.jsx
import React, { useEffect, useState, useRef } from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/UseStore"; // Zustand 상태관리 사용 (필요시 활용)
import { Camera } from "@mediapipe/camera_utils";

const PhotoCapturePage = () => {
  const videoRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // MediaPipe Camera를 초기화하여 video 요소에 스트림 연결
  useEffect(() => {
    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          // 별도의 처리 없이 매 프레임 호출됨
        },
        width: 1280,
        height: 720,
      });
      camera.start();
      return () => {
        // camera 객체에 stop 메서드가 있다면 호출하여 정리
        if (camera.stop) {
          camera.stop();
        }
      };
    }
  }, []);

  // video에서 현재 프레임을 캡쳐하는 함수
  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setPhotos((prev) => [...prev, imageDataUrl]);
    }
  };

  // 사진이 8장이 되면 사진 선택 페이지로 이동
  useEffect(() => {
    if (photos.length === 8) {
      // 필요시 Zustand에 저장할 수도 있음
      navigate("/select", { state: { photos } });
      clearInterval(timerRef.current);
    }
  }, [photos, navigate]);

  // 시작하기 버튼 클릭 시 타이머 시작 (한 번만 클릭)
  const handleStart = () => {
    if (!started) {
      setStarted(true);
      capturePhoto(); // 즉시 1장 캡쳐
      timerRef.current = setInterval(() => {
        capturePhoto();
      }, 5000); // 5초마다 캡쳐
    }
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        {/* Largemain 내부에 video 요소가 꽉 차도록 배치 */}
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <video
            ref={videoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            playsInline
          ></video>
          {/* 시작하기 버튼 (한 번만 보임) */}
          {!started && (
            <button
              onClick={handleStart}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "12px 24px",
                fontSize: "18px",
                zIndex: 1,
                cursor: "pointer",
              }}
            >
              시작하기
            </button>
          )}
        </div>
      </Largemain>
    </Background>
  );
};

export default PhotoCapturePage;
