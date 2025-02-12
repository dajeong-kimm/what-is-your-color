import React, { useEffect, useRef } from 'react';
import './BestWorstCamera2.css'; // 추가 (CSS 파일 분리)

const BestWorstCamera2 = () => {
  const videoRef = useRef(null);
  const numSegments = 15;
  const colors = [
    '#7CB9E8', '#F0F8FF', '#C4B454', '#90EE90', '#FF69B4',
    '#DDA0DD', '#E6E6FA', '#98FB98', '#87CEEB', '#F08080',
    '#E0FFFF', '#FFB6C1', '#B0C4DE', '#FFA07A', '#D8BFD8',
  ];

  useEffect(() => {
    const getWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    getWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const createSegments = () => {
    const segments = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 50;
    const angleStep = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;

      const startX = centerX + radius * Math.cos(startAngle);
      const startY = centerY + radius * Math.sin(startAngle);
      const endX = centerX + radius * Math.cos(endAngle);
      const endY = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = 0;
      const sweepFlag = 1;

      const pathData = `
        M ${centerX} ${centerY}
        L ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}
        Z
      `;

      segments.push(
        <path
          key={i}
          d={pathData}
          fill={colors[i % colors.length]}
          className="segment"
        />
      );
    }

    return segments;
  };

  return (
      <div className="wrapper">
        {/* 배경 원형 분할 */}
        <svg viewBox="0 0 100 100" className="svg-background">
          {createSegments()}
          {/* 마스크용 클리핑 패스 */}
          <defs>
            <clipPath id="circleClip">
              <circle cx="200" cy="200" r="300" />
            </clipPath>
          </defs>
        </svg>

        {/* 웹캠 영상 (마스크 적용) */}
        <div className="video-container">
          <video ref={videoRef} autoPlay playsInline className="webcam-video" />
        </div>

        {/* 노란색 점선 가이드 */}
        {/* <div className="guide-circle" /> */}
      </div>
  );
};

export default BestWorstCamera2;
