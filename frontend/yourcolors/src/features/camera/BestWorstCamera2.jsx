import React, { useEffect, useRef } from 'react';

const BestWorstCamera2 = () => {
  const videoRef = useRef(null);
  const numSegments = 16; // Number of segments around the circle
  const colors = [
    '#7CB9E8', // Blue
    '#F0F8FF', // Light Blue
    '#C4B454', // Cream
    '#90EE90', // Light Green
    '#FF69B4', // Pink
    '#DDA0DD', // Plum
    '#E6E6FA', // Lavender
    '#98FB98', // Pale Green
    '#87CEEB', // Sky Blue
    '#F08080', // Light Coral
    '#E0FFFF', // Light Cyan
    '#FFB6C1', // Light Pink
    '#B0C4DE', // Light Steel Blue
    '#FFA07A', // Light Salmon
    '#D8BFD8', // Thistle
    '#AFEEEE', // Pale Turquoise
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
          className="transition-all duration-300 hover:opacity-80"
        />
      );
    }

    return segments;
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="relative w-full max-w-2xl aspect-square">
        {/* Background segments */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
        >
          {createSegments()}
          {/* Center circle mask */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="white"
          />
        </svg>

        {/* Video container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-3/5 h-3/5 overflow-hidden rounded-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute w-full h-full object-cover transform scale-x-[-1]"
            />
          </div>
        </div>

        {/* Guide circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3/5 h-3/5 rounded-full border-4 border-yellow-400 border-dashed" />
        </div>
      </div>
    </div>
  );
};

export default BestWorstCamera2;