import React, { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/UseStore"; // Zustand 스토어
import LoadingSpinner from "../loading-spinner/LoadingSpinnerS"; // LoadingSpinner 컴포넌트 (경로는 실제 프로젝트 구조에 맞게 수정)
import "./SendButton.css";
import { image } from "framer-motion/client";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const SendButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 변수
  const [sendStatus, setSendStatus] = useState(null); // 전송 결과 메시지 상태
  const keyboardRef = useRef(null);
  const navigate = useNavigate();

  // Zustand 스토어에서 필요한 데이터 가져오기
  const { userImageFile, Results, gptSummary } = useStore();

  // Results 배열의 첫 3개 항목을 각각 bestColor, subColor1, subColor2로 사용
  const bestColor = Results[0] || "";
  const subColor1 = Results[1] || "";
  const subColor2 = Results[2] || "";

  // 모달 열리면 body에 특정 클래스를 추가
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
    setSendStatus(null);
  };

  // 커스텀 키보드 입력 처리
  const handleKeyClick = (key) => {
    setEmail(email + key);
  };

  // 커스텀 키보드 삭제 처리
  const handleDelete = () => {
    setEmail(email.slice(0, -1));
  };

  // 실제 제출 함수 (전송 로직)
  const handleSubmit = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      setSendStatus("유효한 이메일 주소를 입력하세요.");
      setTimeout(() => {
        setSendStatus(null);
      }, 2000);
      return;
    }

    setIsLoading(true); // 전송 시작

    // userImageFile이 FormData라면 내부에서 'image' 또는 'face_image' 키의 Blob 추출
    let imageBlob;
    if (userImageFile instanceof FormData) {
      imageBlob = userImageFile.get("image") || userImageFile.get("face_image");
    } else {
      imageBlob = userImageFile;
    }

    if (!imageBlob) {
      setSendStatus("이미지 파일이 존재하지 않습니다.");
      setIsLoading(false);
      setTimeout(() => {
        setSendStatus(null);
      }, 2000);
      return;
    }

    // 새 FormData 객체 생성 및 데이터 추가
    const formData = new FormData();
    formData.append("email", email);
    formData.append("image", imageBlob, "captured_face.png");
    formData.append("bestColor", bestColor.personal_color);
    formData.append("subColor1", subColor1.personal_color);
    formData.append("subColor2", subColor2.personal_color);

    const htmlMessage = marked(gptSummary || "");
    formData.append("message", htmlMessage);

    // (디버깅용) FormData 내용 확인
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
      setSendStatus("이메일 전송에 성공하였습니다.");
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error("이메일 전송 실패:", error);
      setSendStatus("이메일 전송에 실패하였습니다.");
      setTimeout(() => {
        setSendStatus(null);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // 제출 버튼 클릭 시 키보드가 열려 있다면 먼저 닫고 바로 제출하는 래퍼 함수
  const handleSubmitWrapper = () => {
    if (isKeyboardOpen) {
      setIsKeyboardOpen(false);
      // 키보드가 닫힌 후, requestAnimationFrame을 사용해 바로 제출
      requestAnimationFrame(() => {
        handleSubmit();
      });
    } else {
      handleSubmit();
    }
  };

  // 커스텀 키보드에 사용할 키 배열
  const row1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".com"];
  const row2 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "⌫"];
  const row3 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "@"];
  const row4 = ["z", "x", "c", "v", "b", "n", "m", ".", "_"];

  return (
    <div className="send-button-container">
      <button className="send-button" onClick={handleOpenModal}>
        이메일로 결과표 받기
      </button>

      {isModalOpen && (
        <div className="send-modal-overlay">
          <div className={`send-modal-content ${isKeyboardOpen ? "modal-up" : ""}`}>
            <button className="modal-x-button" onClick={handleCloseModal}>
              ✖
            </button>
            <h2>이메일을 입력하세요</h2>
            <div className="email-input-wrapper" onClick={() => setIsKeyboardOpen(true)}>
            <input
              type="text"
              className="email-input"
              value={email}
              placeholder="이메일 입력"
              onChange={(e) => setEmail(e.target.value)}  // 키보드 입력 허용
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmitWrapper(); // Enter 키로 제출
                }
              }}
              onClick={() => setIsKeyboardOpen(true)}
            />

            </div>
            <div className="send-modal-buttons">
              {isLoading ? (
                <span
                  className="sending-status"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#0b7c3e",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  전송중{" "}
                  <span style={{ display: "inline-block", marginLeft: "5px" }}>
                    <LoadingSpinner loading={true} size={20} />
                  </span>
                </span>
              ) : sendStatus ? (
                <span
                  className="sending-status"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#0b7c3e",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {sendStatus}
                </span>
              ) : (
                <button className="send-modal-yes" onClick={handleSubmitWrapper}>
                  제출하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isKeyboardOpen && (
        <div className="keyboard-modal-overlay">
          <div className="keyboard-modal-content" ref={keyboardRef} onClick={(e) => e.stopPropagation()}>
            <div className="keyboard-row">
              {row1.map((key) => (
                <button key={key} className="keyboard-key" onClick={() => handleKeyClick(key)}>
                  {key}
                </button>
              ))}
            </div>
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
