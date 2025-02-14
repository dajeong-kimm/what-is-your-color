import React, { useEffect, useState, useRef } from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/UseStore";
import { Camera } from "@mediapipe/camera_utils";
import "./PhotoCapturePage.css";

const PhotoCapturePage = () => {
  const videoRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {},
        width: 1280,
        height: 720,
      });
      camera.start();
      return () => {
        if (camera.stop) {
          camera.stop();
        }
      };
    }
  }, []);

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

  useEffect(() => {
    if (photos.length === 8) {
      navigate("/select", { state: { photos } });
      clearInterval(timerRef.current);
    }
  }, [photos, navigate]);

  const handleStart = () => {
    if (!started) {
      setStarted(true);
      let count = 3;
      setCountdown(count);
      const countdownInterval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(countdownInterval);
          setCountdown(null);
          capturePhoto();
          timerRef.current = setInterval(() => {
            capturePhoto();
          }, 5000);
        }
      }, 1000);
    }
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="photo-header-bar">
          <span className="photo-title">계절네컷</span>
          <span className="photo-countdown">{countdown !== null ? countdown : ""}</span>
          <span className="photo-count">{photos.length}/8</span>
        </div>
        <div className="photo-video-container">
          <video ref={videoRef} className="photo-video" autoPlay muted playsInline></video>
          {!started && (
            <button onClick={handleStart} className="photo-start-button">
              시작하기
            </button>
          )}
        </div>
      </Largemain>
    </Background>
  );
};

export default PhotoCapturePage;
