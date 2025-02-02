import React, { useState } from "react";
import "./DiagnosticBox.css"; // 스타일 파일 임포트

const DiagnosticBox = () => {
  const [checkedItems, setCheckedItems] = useState({
    eyeColor: false,
    hairColor: false,
    brightSkin: false,
    darkSkin: false,
  });

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="container">
      <div className="box">
        <h3>컬러 추출을 위해 체크하세요</h3>
        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="eyeColor"
              checked={checkedItems.eyeColor}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            눈동자
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="hairColor"
              checked={checkedItems.hairColor}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            머리카락
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="brightSkin"
              checked={checkedItems.brightSkin}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            밝은 피부
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="darkSkin"
              checked={checkedItems.darkSkin}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            어두운 피부
          </label>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticBox;
