import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import PhotoFrameTwo from "./PhotoFrameTwo"; // PhotoFrameTwo 사용
import html2canvas from "html2canvas";
import useStore from "../../store/UseStore";
import LoadingSpinner from "../../button/loading-spinner/LoadingSpinnerS"; // 경로 확인 필요
import saleGif from "../../images/sale.gif";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const PhotoSelectionPageTwo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photos } = location.state || { photos: [] };
  const [selectedPhotoIndices, setSelectedPhotoIndices] = useState([]);
  const [captureMode, setCaptureMode] = useState(false);
  // 인쇄 진행 상태(모달 표시)를 위한 상태
  const [isPrinting, setIsPrinting] = useState(false);

  // 디자인 상태 (전체 디자인 개수: 12)
  const totalDesigns = 12;
  const { userPersonalId, userEmail } = useStore();
  const initialDesign =
    Number(userPersonalId) >= 1 && Number(userPersonalId) <= totalDesigns ? Number(userPersonalId) : 1;
  const [designNum, setDesignNum] = useState(initialDesign);

  // 오른쪽에 보여지는 프레임의 ref (캡처 대상)
  const displayFrameRef = useRef(null);

  // 사진 선택/해제 (최대 2장, 사진은 인덱스 0~7)
  const toggleSelectPhoto = (idx) => {
    const photo = photos[idx];
    if (!photo) return;
    if (selectedPhotoIndices.includes(idx)) {
      setSelectedPhotoIndices(selectedPhotoIndices.filter((i) => i !== idx));
    } else {
      if (selectedPhotoIndices.length < 2) {
        setSelectedPhotoIndices([...selectedPhotoIndices, idx]);
      }
    }
  };

  // 인쇄 버튼 → 오른쪽 프레임 캡처 및 이미지 변환
  const handlePrint = async () => {
    if (selectedPhotoIndices.length !== 2) {
      alert("두 장 모두 선택해야 인쇄할 수 있습니다!");
      return;
    }
    setCaptureMode(true);
    setIsPrinting(true); // 모달 표시
    // UI 갱신 대기
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // 1) 오른쪽 프레임 캡처
      const canvas = await html2canvas(displayFrameRef.current, {
        useCORS: true,
        allowTaint: false,
      });
      const dataUrl = canvas.toDataURL("image/jpeg");

      // 2) blob / file 변환
      const responseFetch = await fetch(dataUrl);
      const blob = await responseFetch.blob();
      const file = new File([blob], "photo-frame.jpg", { type: blob.type });

      // 3) 이메일 전송
      const emailFormData = new FormData();
      emailFormData.append("email", "hyunddoing@naver.com");
      emailFormData.append("image", file);

      const emailResponse = await fetch(`${apiBaseUrl}/api/photos/mail`, {
        method: "POST",
        body: emailFormData,
      });
      if (!emailResponse.ok) {
        alert("이메일 전송에 실패했습니다.");
      }

      // 4) 업로드 작업
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const uploadResponse = await fetch(`${apiBaseUrl}/api/photos/upload`, {
        method: "POST",
        body: uploadFormData,
      });
      if (!uploadResponse.ok) {
        alert("파일 업로드에 실패했습니다.");
        return;
      }

      // 5) 업로드 후 QR 코드 URL 정보 받기
      const data = await uploadResponse.json();

      // 6) ★ 40초 뒤에 다음 페이지로 이동
      setTimeout(() => {
        navigate("/qr-codetwo", {
          state: {
            qrCodeUrl: data.qr_code_url,
            compositeImage: dataUrl,
          },
        });
        // 이동 후 모달 닫기
        setIsPrinting(false);
        setCaptureMode(false);
      }, 10000);
    } catch (error) {
      console.error(error);
      alert("인쇄 처리 중 오류가 발생했습니다.");
      // 에러 발생 시 모달 닫기
      setIsPrinting(false);
      setCaptureMode(false);
    }
  };

  // 선택된 사진들의 URL 배열 (인덱스 0~7)
  const selectedPhotoUrls = selectedPhotoIndices.map((i) => photos[i]);

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="photo-selection-container">
          {/* 왼쪽 그리드: 인덱스 0~7는 사진, 인덱스 8은 선택 개수/인쇄 버튼 */}
          <div className="photo-grid">
            {Array.from({ length: 9 }).map((_, idx) => {
              if (idx === 8) {
                return (
                  <div
                    className="photo-cell photo-count"
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedPhotoIndices.length === 2 ? (
                      <button
                        onClick={handlePrint}
                        className="print-button"
                        style={{
                          fontSize: "2rem",
                          color: "#000000",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <span role="img" aria-label="print">
                          🖨️
                          <br />
                          인쇄하기
                        </span>
                      </button>
                    ) : (
                      `${selectedPhotoIndices.length} / 2`
                    )}
                  </div>
                );
              }
              const photo = photos[idx];
              const isSelected = selectedPhotoIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className={photo ? `photo-cell ${isSelected ? "selected" : ""}` : "photo-cell empty"}
                  onClick={() => photo && toggleSelectPhoto(idx)}
                >
                  {photo ? <img src={photo} alt={`사진 ${idx + 1}`} crossOrigin="anonymous" /> : <span>빈 사진</span>}
                  {photo && isSelected && <div className="overlay" />}
                </div>
              );
            })}
          </div>

          <div className="photo-frame-container">
            <div className="photo-frame-wrapper">
              <PhotoFrameTwo
                ref={displayFrameRef}
                selectedPhotos={selectedPhotoUrls}
                hideArrows={captureMode}
                designNum={designNum}
                onNextDesign={() => setDesignNum((prev) => (prev === totalDesigns ? 1 : prev + 1))}
                onPrevDesign={() => setDesignNum((prev) => (prev === 1 ? totalDesigns : prev - 1))}
              />
            </div>
          </div>
        </div>
      </Largemain>

      {/* 인쇄 중 모달 (40초간 유지) */}
      {isPrinting && (
        <div
        className="printing-modal-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          fontFamily: 'netmarbleB',

        }}
      >
        <div
          className="printing-modal-content"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          
          {/* 예시로 페이지 상단에 배치 */}
          <img src={saleGif} alt="Loading GIF" style={{ width: "300px" }} />

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "2rem",
            fontWeight: "bold",
            marginTop: "20px",
          }}>
            <span style={{ fontWeight: "bold",
                  fontSize: "1.2rem",
                  color: "#0b7c3e", }}>인쇄 중</span>
            <LoadingSpinner loading={true} size={50} />
          </div>
        </div>
      </div>
      )}
    </Background>
  );
};

export default PhotoSelectionPageTwo;
