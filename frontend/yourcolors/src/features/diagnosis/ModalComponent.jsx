import React from "react";
import { useModalStore } from "../../store/useModalStore";

const ModalComponent = () => {
    const { isOpen, message, closeModal } = useModalStore(); // Zustand 상태 가져오기

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // 가장 위에 표시
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>{message}</p>
        <button
          onClick={closeModal}
          style={{
            backgroundColor: "#82DC28",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ModalComponent;
