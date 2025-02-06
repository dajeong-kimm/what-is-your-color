import React from 'react';
import './BackGround.css';


const Largemain = ({ children }) => {
  return (
    <div className="Large-main">
      {children} {/* 자식 컴포넌트가 이곳에 렌더링됩니다 */}
    </div>
  );

};

export default Largemain;
