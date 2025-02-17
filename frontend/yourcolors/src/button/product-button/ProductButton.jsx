import React, { useState, useEffect } from "react";
import "./ProductButton.css";

let uniqueIdCounter = 0;

const ProductButton = ({ text, onClick }) => {
  const [isActive, setIsActive] = useState(false);
  const [id] = useState(() => {
    uniqueIdCounter += 1;
    return uniqueIdCounter;
  });

  const handleClick = () => {
    if (isActive) {
      // 이미 활성 상태면 비활성화합니다.
      setIsActive(false);
    } else {
      // 다른 버튼들을 비활성화하기 위해 커스텀 이벤트를 발송하고 자신은 활성화합니다.
      const event = new CustomEvent("productButtonClicked", { detail: { id } });
      window.dispatchEvent(event);
      setIsActive(true);
    }
    // Makeup.jsx에서 전달된 onClick 실행
    if (typeof onClick === "function") {
      onClick();
    }
  };

  useEffect(() => {
    const handleOtherButtonClick = (e) => {
      // 자신이 아닌 다른 버튼에서 이벤트가 발생하면 비활성화합니다.
      if (e.detail.id !== id) {
        setIsActive(false);
      }
    };

    window.addEventListener("productButtonClicked", handleOtherButtonClick);
    return () => {
      window.removeEventListener("productButtonClicked", handleOtherButtonClick);
    };
  }, [id]);

  return (
    <button className={`product-button ${isActive ? "active" : ""}`} onClick={handleClick}>
      {text}
    </button>
  );
};

export default ProductButton;
