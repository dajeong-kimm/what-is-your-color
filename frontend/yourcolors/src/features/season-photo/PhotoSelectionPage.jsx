import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import PhotoFrame from "./PhotoFrame";
import html2canvas from "html2canvas";
import "./PhotoSelectionPage.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const PhotoSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photos } = location.state || { photos: [] };
  const [selectedPhotoIndices, setSelectedPhotoIndices] = useState([]);
  const [captureMode, setCaptureMode] = useState(false);

  // 실제 화면에 보이는 단일 프레임
  const displayFrameRef = useRef(null);
  // 숨겨진(캡처용) 프레임 2개 컨테이너
  const captureRef = useRef(null);

  // 사진 선택/해제 (최대 4장)
  const toggleSelectPhoto = (idx) => {
    const photo = photos[idx];
    if (!photo) return;
    if (selectedPhotoIndices.includes(idx)) {
      setSelectedPhotoIndices(selectedPhotoIndices.filter((i) => i !== idx));
    } else {
      if (selectedPhotoIndices.length < 4) {
        setSelectedPhotoIndices([...selectedPhotoIndices, idx]);
      }
    }
  };

  // 인쇄 버튼 → QR 코드용 이미지 캡처
  const handlePrint = async () => {
    if (selectedPhotoIndices.length !== 4) {
      alert("네 컷 모두 선택해야 인쇄할 수 있습니다!");
      return;
    }
    setCaptureMode(true);

    await new Promise((resolve) => setTimeout(resolve, 100)); // UI 갱신 대기

    try {
      // 숨겨진 영역 캡처
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        allowTaint: false,
      });
      const dataUrl = canvas.toDataURL("image/jpeg");

      // 업로드
      const responseFetch = await fetch(dataUrl);
      const blob = await responseFetch.blob();
      const file = new File([blob], "photo-frame.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(`${apiBaseUrl}/api/photos/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        alert("파일 업로드에 실패했습니다.");
        return;
      }

      const data = await uploadResponse.json();
      navigate("/qr-code", {
        state: {
          qrCodeUrl: data.qr_code_url,
          compositeImage: dataUrl,
        },
      });
    } catch (error) {
      console.error(error);
      alert("인쇄 처리 중 오류가 발생했습니다.");
    } finally {
      setCaptureMode(false);
    }
  };

  // 선택된 사진들의 URL 배열
  const selectedPhotoUrls = selectedPhotoIndices.map((i) => photos[i]);

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="photo-selection-container">
          {/* 왼쪽 3x3 그리드 */}
          <div className="photo-grid">
            {Array.from({ length: 9 }).map((_, idx) => {
              // 마지막 칸(9번째, 인덱스 8)
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
                    {selectedPhotoIndices.length === 4 ? (
                      <button
                        onClick={handlePrint}
                        className="print-button"
                        style={{
                          fontSize: "2rem",
                          color:"#000000",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <span role="img" aria-label="print">
                          🖨️<br/>
                          인쇄하기
                        </span>
                        
                      </button>
                    ) : (
                      `${selectedPhotoIndices.length} / 4`
                    )}
                  </div>
                );
              }

              // 그 외 칸(0~7)
              const photo = photos[idx];
              const isSelected = selectedPhotoIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className={
                    photo ? `photo-cell ${isSelected ? "selected" : ""}` : "photo-cell empty"
                  }
                  onClick={() => photo && toggleSelectPhoto(idx)}
                >
                  {photo ? (
                    <img src={photo} alt={`사진 ${idx + 1}`} crossOrigin="anonymous" />
                  ) : (
                    <span>빈 사진</span>
                  )}
                  {photo && isSelected && <div className="overlay" />}
                </div>
              );
            })}
          </div>

          {/* 오른쪽: 실제 화면에 보여지는 단일 프레임 */}
          <div className="photo-frame-container">
            <div className="photo-frame-wrapper">
              <PhotoFrame
                ref={displayFrameRef}
                selectedPhotos={selectedPhotoUrls}
                hideArrows={captureMode}
              />
            </div>
          </div>
        </div>

        {/* 보이지 않는 캡처용 영역 */}
        <div
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
          }}
          ref={captureRef}
        >
          <div style={{ display: "flex" }}>
            {/* 첫 번째 프레임 */}
            <PhotoFrame
              selectedPhotos={selectedPhotoUrls}
              hideArrows={true}
            />
            {/* 두 번째 프레임 */}
            <PhotoFrame
              selectedPhotos={selectedPhotoUrls}
              hideArrows={true}
            />
          </div>
        </div>
      </Largemain>
    </Background>
  );
};

export default PhotoSelectionPage;
