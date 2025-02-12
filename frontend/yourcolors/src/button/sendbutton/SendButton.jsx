import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SendButton.css";

const SendButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const navigate = useNavigate();
  const keyboardRef = useRef(null);
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isModalOpen]);
  // 문서 전체의 클릭 이벤트를 등록하여,
  // 키보드 모달 콘텐츠 영역 외부를 클릭하면 키보드 모달을 닫음
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isKeyboardOpen &&
        keyboardRef.current &&
        !keyboardRef.current.contains(event.target)
      ) {
        setIsKeyboardOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isKeyboardOpen]);

  // 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 (이메일 및 키보드 모달 모두 닫고, 입력값 초기화)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsKeyboardOpen(false);
    setEmail("");
  };

  // 키 입력 처리 (일반 문자 입력)
  const handleKeyClick = (key) => {
    setEmail(email + key);
  };

  // 삭제 버튼 처리
  const handleDelete = () => {
    setEmail(email.slice(0, -1));
  };

  // 제출 버튼 클릭 시 이메일 유효성 검사 후 모달 닫기
  const handleSubmit = () => {
    // 간단한 유효성 검사: "@"와 "."이 포함되어 있는지 확인
    if (!email.includes("@") || !email.includes(".")) {
      alert("유효한 이메일 주소를 입력하세요.");
      return;
    }
    alert(`이메일 ${email}로 결과표를 발송했습니다.`);
    handleCloseModal();
  };

  // 각 행별로 키 배열 정의
  const row1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const row2 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "⌫"];
  const row3 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "@"];
  const row4 = ["z", "x", "c", "v", "b", "n", "m", ".", "_"];

  return (
    <div className="send-button-container">
      {/* 이메일로 결과표 받기 버튼 */}
      <button className="send-button" onClick={handleOpenModal}>
        이메일로 결과표 받기
      </button>

      {/* 이메일 입력 모달 */}
      {isModalOpen && (
        <div className="send-modal-overlay">
          {/* 이메일 입력 모달 콘텐츠에 isKeyboardOpen에 따라 modal-up 클래스 추가 */}
          <div className={`send-modal-content ${isKeyboardOpen ? "modal-up" : ""}`}>
            {/* 이메일 모달 닫기 버튼 */}
            <button className="modal-x-button" onClick={handleCloseModal}>
              ✖
            </button>
            <h2>이메일을 입력하세요</h2>
            {/* 입력창 전체 영역을 감싸는 div: 클릭 시 키보드 모달 오픈 */}
            <div
              className="email-input-wrapper"
              onClick={() => setIsKeyboardOpen(true)}
            >
              <input
                type="text"
                className="email-input"
                onClick={() => setIsKeyboardOpen(true)}

                
                value={email}
                readOnly
                placeholder="이메일 입력"
              />
            </div>
            <div className="send-modal-buttons">
              <button className="send-modal-yes" onClick={handleSubmit}>
                제출하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이메일 입력용 커스텀 키보드 모달 */}
      {isKeyboardOpen && (
        <div className="keyboard-modal-overlay">
          {/* 키보드 모달 콘텐츠 영역 (ref 적용) */}
          <div
            className="keyboard-modal-content"
            ref={keyboardRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 첫 번째 행 */}
            <div className="keyboard-row">
              {row1.map((key) => (
                <button
                  key={key}
                  className="keyboard-key"
                  onClick={() => handleKeyClick(key)}
                >
                  {key}
                </button>
              ))}
            </div>
            {/* 두 번째 행 */}
            <div className="keyboard-row">
              {row2.map((key) => (
                <button
                  key={key}
                  className={`keyboard-key ${key === "⌫" ? "special-key" : ""}`}
                  onClick={() => {
                    if (key === "⌫") {
                      handleDelete();
                    } else {
                      handleKeyClick(key);
                    }
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
            {/* 세 번째 행 */}
            <div className="keyboard-row">
              {row3.map((key) => (
                <button
                  key={key}
                  className={`keyboard-key ${key === "@" ? "special-key" : ""}`}
                  onClick={() => handleKeyClick(key)}
                >
                  {key}
                </button>
              ))}
            </div>
            {/* 네 번째 행 */}
            <div className="keyboard-row">
              {row4.map((key) => (
                <button
                  key={key}
                  className={`keyboard-key ${
                    key === "." || key === "_" ? "special-key" : ""
                  }`}
                  onClick={() => handleKeyClick(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendButton;
