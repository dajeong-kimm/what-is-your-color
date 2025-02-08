import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import './LoadingPage.css';
import Background from '../../background/background/Background';

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;

  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500);

    const timeout = setTimeout(() => {
      navigate('/diagresult', { state: { capturedImage } }); // ✅ 2초 후 diagresult로 이동
    }, 2000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timeout);
    };
  }, [navigate, capturedImage]);

  return (
    <div className="loading-wrapper">
      <Background />
      <div className="loading-container">
        <LoadingSpinner />
        <p className="loading-text">분석 준비 중입니다. 잠시만 기다려주세요{dots}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
