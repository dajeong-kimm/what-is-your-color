import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/UseStore"; // Zustand 스토어
import "./SendButton.css";
import { image } from "framer-motion/client";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const SendButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const keyboardRef = useRef(null);
  const navigate = useNavigate();

  // Zustand 스토어에서 필요한 데이터 가져오기
  const { userImageFile, Results, gptSummary } = useStore();

  // 예시: Results 배열의 첫 3개 항목을 각 컬러 결과로 사용
  const bestColor = Results[0] || "";
  const subColor1 = Results[1] || "";
  const subColor2 = Results[2] || "";

  // 모달이 열리면 body에 특정 클래스를 추가
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isModalOpen]);

  // 키보드 모달 외부 클릭 시 닫힘 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isKeyboardOpen && keyboardRef.current && !keyboardRef.current.contains(event.target)) {
        setIsKeyboardOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isKeyboardOpen]);

  // 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 및 입력값 초기화
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsKeyboardOpen(false);
    setEmail("");
  };

  // 커스텀 키보드 입력 처리
  const handleKeyClick = (key) => {
    setEmail(email + key);
  };

  // 커스텀 키보드 삭제 처리
  const handleDelete = () => {
    setEmail(email.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("유효한 이메일 주소를 입력하세요.");
      return;
    }

    // userImageFile이 FormData라면, 내부에서 'face_image'라는 키로 저장된 파일(Blob)을 추출합니다.
    let imageBlob;
    if (userImageFile instanceof FormData) {
      imageBlob = userImageFile.get("image") || userImageFile.get("face_image");
    } else {
      imageBlob = userImageFile;
    }

    if (!imageBlob) {
      alert("이미지 파일이 존재하지 않습니다.");
      return;
    }

    // 새 FormData 객체 생성
    const formData = new FormData();
    formData.append("email", email);
    // 백엔드에서는 "image"라는 이름을 기대하므로, 추출한 Blob을 해당 키로 추가합니다.
    formData.append("image", imageBlob, "captured_face.png");

    // 만약 bestColor, subColor1, subColor2가 객체라면, 필요한 값(예: name 속성)만 추출하거나 JSON 문자열로 변환
    // 예시로 JSON.stringify()를 사용:
    formData.append("bestColor", JSON.stringify(bestColor));
    formData.append("subColor1", JSON.stringify(subColor1));
    formData.append("subColor2", JSON.stringify(subColor2));
    formData.append("message", gptSummary || "");

    // 디버깅: FormData 내용 확인
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/result/mail`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("서버 오류 응답 내용:", errorText);
        throw new Error("서버 응답 에러");
      }
      const responseText = await response.text();
      alert(responseText);
      handleCloseModal();
    } catch (error) {
      console.error("이메일 전송 실패:", error);
      alert("이메일 전송 중 오류가 발생했습니다.");
    }
  };

  // 커스텀 키보드에 사용할 키 배열
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
          <div className={`send-modal-content ${isKeyboardOpen ? "modal-up" : ""}`}>
            {/* 모달 닫기 버튼 */}
            <button className="modal-x-button" onClick={handleCloseModal}>
              ✖
            </button>
            <h2>이메일을 입력하세요</h2>
            {/* 입력창 클릭 시 커스텀 키보드 오픈 */}
            <div className="email-input-wrapper" onClick={() => setIsKeyboardOpen(true)}>
              <input
                type="text"
                className="email-input"
                value={email}
                readOnly
                placeholder="이메일 입력"
                onClick={() => setIsKeyboardOpen(true)}
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

      {/* 커스텀 키보드 모달 */}
      {isKeyboardOpen && (
        <div className="keyboard-modal-overlay">
          <div className="keyboard-modal-content" ref={keyboardRef} onClick={(e) => e.stopPropagation()}>
            {/* 첫 번째 행 */}
            <div className="keyboard-row">
              {row1.map((key) => (
                <button key={key} className="keyboard-key" onClick={() => handleKeyClick(key)}>
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
                  className={`keyboard-key ${key === "." || key === "_" ? "special-key" : ""}`}
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
