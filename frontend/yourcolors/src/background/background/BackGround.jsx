// 모든 페이지의 공통이 되는 연두색 배경 (서브 박스 x)

import React from "react";
import "./BackGround.css";

const Background = ({ children }) => {
  return <div className="Sub-back">{children}</div>; // 내부 요소 감싸기
};

export default Background;
