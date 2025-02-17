import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LeftRightButton.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const LeftRightButton = ({ currentStep, onLeftClick, onRightClick }) => {
  const navigate = useNavigate();

  const handleRightClick = () => {
    if (currentStep === 3) {
      navigate('/makeup');
    } else {
      onRightClick();
    }
  };

  return (
    <div className="navigation-buttons">
      {/* currentStep이 0일 때도 공간을 유지하도록 visibility: hidden 적용 */}
      <button 
        className="nav-button"
        onClick={onLeftClick}
        style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
      >
        <FaArrowLeft className="nav-arrow" />
      </button>
      
      <button 
        className="nav-button"
        onClick={handleRightClick}
      >
         <FaArrowRight className="nav-arrow" />
      </button>
    </div>
  );
};

export default LeftRightButton;
