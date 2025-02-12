import React from 'react';
import BeatLoader from "react-spinners/BeatLoader"; // BeatLoader 임포트
import './LoadingSpinner.css';

const LoadingSpinnerS = ({ loading = true }) => {
  return (
    <div className="spinner-wrapper">
      <BeatLoader
        color="#0b7c3e"
        loading={loading}
        size={15}        // 스피너 원의 크기 (필요에 따라 조절)
        margin={2}       // 원들 사이의 간격 (필요에 따라 조절)
      />
    </div>
  );
};

export default LoadingSpinnerS;
