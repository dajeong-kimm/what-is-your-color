import React, { useState, useEffect } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import './LoadingPage.css';
import Background from '../../background/background/BackGround';

const LoadingPage = () => {
  const [dots, setDots] = useState(""); // 점 개수 상태 관리

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500); // 0.5초마다 변화

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-wrapper">
      <Background />  {/* 배경을 포함 */}
      <div className="loading-container">
        <LoadingSpinner />
        <p className="loading-text">분석 중이니 잠시만 기다려주세요{dots}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
