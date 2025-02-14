// QRTestButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const QRTestButton = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    // 버튼 클릭 시 /qrtest 경로로 이동합니다.
    navigate("/qrtest");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={handleNavigation}>QR 테스트 페이지로 이동</button>
    </div>
  );
};

export default QRTestButton;
