import React from "react";
import CloseButton from "../closebutton/CloseButton";
import "./BottomBarPersonal.css"; // 새 CSS 파일 사용

const BottomBarPersonal = () => {
  return (
    <div className="bottom-bar-personal">
      <div className="bottom-bar-inner">
        <CloseButton />
      </div>
    </div>
  );
};

export default BottomBarPersonal;
