import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import './LoadingPage.css';
import Background from '../../background/background/Background';
import useStore from "../../store/useStore"; // Zustand store import

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;

  const [dots, setDots] = useState("");
  const { Results, gptSummary } = useStore(); // Zustand 상태 가져오기

  // 안쓰는 코드 주석함
  // useEffect(() => {
  //   const dotInterval = setInterval(() => {
  //     setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
  //   }, 500);

  //   const timeout = setTimeout(() => {
  //     navigate('/diagresult', { state: { capturedImage } }); // ✅ 2초 후 diagresult로 이동
  //   }, 2000);

  //   return () => {
  //     clearInterval(dotInterval);
  //     clearTimeout(timeout);
  //   };
  // }, [navigate, capturedImage]);


  useEffect(() => {
    // 점 애니메이션 (로딩 효과)
    const dotInterval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500);

    return () => {
      clearInterval(dotInterval);
    };
  }, []);

  
  useEffect(() => {
    // ✅ Results가 비어있지 않고 gptSummary가 존재하면 diagresult로 이동
    if (Results.length > 0 && gptSummary) {
      navigate("/diagresult");
    }
  }, [Results, gptSummary, navigate]);

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
