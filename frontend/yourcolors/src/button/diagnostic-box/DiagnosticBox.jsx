import React, { useState, useEffect } from "react";
import "./DiagnosticBox.css"; // 스타일 파일 임포트

const DiagnosticBox = () => {
  const [checkedItems, setCheckedItems] = useState({
    eyeColor: false,
    hairColor: false,
    brightSkin: false,
    darkSkin: false,
  });

  const [currentIndex, setCurrentIndex] = useState(0); // 현재 체크할 항목 인덱스
  const checkOrder = ["eyeColor", "hairColor", "brightSkin", "darkSkin"];

  useEffect(() => {
    if (currentIndex >= checkOrder.length) return; // 모든 체크 완료 시 중단

    const interval = setInterval(() => {
      setCheckedItems((prev) => ({
        ...prev,
        [checkOrder[currentIndex]]: true,
      }));
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  }, [currentIndex]); // currentIndex가 변경될 때마다 실행

  return (
    <div className="container">
      <div className="box">
        <h2>컬러 추출을 시작합니다</h2>
        <div className="divider"></div>

        <div className="checkbox-container">
          {checkOrder.map((key) => (
            <label className="checkbox-label" key={key}>
              <input
                type="checkbox"
                name={key}
                checked={checkedItems[key]}
                readOnly
                className="checkbox"
              />
              {key === "eyeColor" ? "눈동자" : 
               key === "hairColor" ? "머리카락" : 
               key === "brightSkin" ? "밝은 피부" : "어두운 피부"}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticBox;
