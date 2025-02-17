import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import LoadingSpinner from "../loading-spinner/LoadingSpinnerS"; // 경로 확인 필요
import "./QRCodePage.css"; // CSS 재사용 또는 별도 파일로 관리
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const QrCodePage = () => {
  const location = useLocation();
  const { qrCodeUrl, compositeImage } = location.state || {};

  // 이메일 전송 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const keyboardRef = useRef(null);

  // 모달 열릴 때 body에 클래스 추가 (스크롤 방지 등)
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isModalOpen]);

  // 키보드 모달 외부 클릭 시 닫힘
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isKeyboardOpen && keyboardRef.current && !keyboardRef.current.contains(event.target)) {
        setIsKeyboardOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isKeyboardOpen]);

  // 모달 열기/닫기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsKeyboardOpen(false);
    setEmail("");
    setSendStatus(null);
  };

  // 커스텀 키보드 입력 처리
  const handleKeyClick = (key) => {
    setEmail((prev) => prev + key);
  };

  // 커스텀 키보드 삭제 처리
  const handleDelete = () => {
    setEmail((prev) => prev.slice(0, -1));
  };

  // 실제 전송 함수: compositeImage를 Blob으로 받아 백엔드에 전송
  const handleSubmit = async () => {
    // 간단한 이메일 유효성 검사
    if (!email.includes("@") || !email.includes(".")) {
      setSendStatus("유효한 이메일 주소를 입력하세요.");
      setTimeout(() => setSendStatus(null), 2000);
      return;
    }

    // compositeImage가 있는지 확인
    if (!compositeImage) {
      setSendStatus("전송할 이미지가 존재하지 않습니다.");
      setTimeout(() => setSendStatus(null), 2000);
      return;
    }

    setIsLoading(true);

    // compositeImage URL을 통해 Blob 생성 (dataURI도 가능)
    let imageBlob;
    try {
      const response = await fetch(compositeImage);
      imageBlob = await response.blob();
    } catch (error) {
      console.error("이미지 변환 실패:", error);
      setSendStatus("이미지를 불러오는데 실패했습니다.");
      setIsLoading(false);
      setTimeout(() => setSendStatus(null), 2000);
      return;
    }

    // FormData 생성 및 데이터 추가
    const formData = new FormData();
    formData.append("email", email);
    formData.append("image", imageBlob, "composite_image.jpg");

    // (디버깅) FormData 내용 출력
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/photos/mail`, {
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
      setTimeout(() => setSendStatus(null), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // 제출 버튼 클릭 시 키보드가 열려 있다면 먼저 닫고 제출
  const handleSubmitWrapper = () => {
    if (isKeyboardOpen) {
      setIsKeyboardOpen(false);
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
    <Background>
      <Topbar />
      <Largemain>
        {/* 컨테이너: 왼쪽 사진 영역 + 오른쪽 QR/버튼 영역 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch", // 높이를 동일하게 맞추려면 stretch 사용
            gap: "20px",
            width: "100%",
            // 아래 예시는 흰색 배경을 주고, 원하는 높이를 지정한 예시입니다.
            // 높이는 프로젝트에 맞춰 적절히 변경하세요.
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {/* 왼쪽 사진 영역 */}
          {compositeImage && (
            <div
              style={{
                flex: "0 0 auto", // 사진 영역은 필요한 만큼만 차지
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: "300px",
              }}
            >
              {/* 사진 높이를 오른쪽과 동일하게 300px로 맞추고, 넘치면 contain으로 축소 */}
              <img
                src={compositeImage}
                alt="합쳐진 사진"
                style={{
                  width: "auto",
                  height: "700px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          {/* 오른쪽 QR/버튼 영역 */}
          <div
            style={{
              flex: "1 1 auto", // 남는 공간을 자동으로 차지
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // 전체 높이 300px에 맞춰서 정렬
              height: "100%",
            }}
          >
            {qrCodeUrl ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row", // QR 코드와 버튼을 한 줄에
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>QR 코드</h3>
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    style={{
                      width: "300px",
                      height: "300px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <button className="send-button" style={{ whiteSpace: "nowrap" }} onClick={handleOpenModal}>
                  이메일로 이미지 받기
                </button>
              </div>
            ) : (
              <p>QR 코드가 생성되지 않았습니다.</p>
            )}
          </div>
        </div>
      </Largemain>

      {/* 모달 부분은 기존과 동일 */}
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
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitWrapper();
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

      {/* 커스텀 키보드 모달 */}
      {isKeyboardOpen && (
        <div className="keyboard-modal-overlay">
          <div className="keyboard-modal-content" ref={keyboardRef} onClick={(e) => e.stopPropagation()}>
            {/* 키보드 구현 부분은 동일 */}
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
    </Background>
  );
};

export default QrCodePage;
