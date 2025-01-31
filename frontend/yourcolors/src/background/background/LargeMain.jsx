// 큰 연두색 배경 안에 main box (큰 버전)

import React from 'react';
import './Background.css';

const largemain = ({ children }) => {
    return (
      <div className="Large-main">{children}
      </div>
    );
};

export default largemain;