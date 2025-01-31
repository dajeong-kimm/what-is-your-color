import React from 'react';
import PuffLoader from "react-spinners/PuffLoader";
import './LoadingSpinner.css';

const LoadingSpinner = ({ loading = true }) => {
  return (
    <div className="spinner-wrapper">
      <PuffLoader
        color="#0b7c3e"
        loading={loading}
        size={60}
        speedMultiplier={2}
      />
    </div>
  );
};

export default LoadingSpinner;