// 큰 연두색 배경 안에 main box (작은 버전)

import React from 'react';
import './Background.css';

const Smallmain = ({ children }) => {
    return (
      <div className="Small-main">
        { children }
      </div>
    );
};

export default Smallmain;