import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import PhotoFrame from "./PhotoFrame";
import html2canvas from "html2canvas";
import "./PhotoSelectionPage.css";

const PhotoSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photos } = location.state || { photos: [] };
  const [selectedPhotoIndices, setSelectedPhotoIndices] = useState([]);
  const [captureMode, setCaptureMode] = useState(false);
  const frameRef = useRef(null);

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
      return; // 네 컷 모두 선택되지 않으면 작업 중단
    }
    setCaptureMode(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const canvas = await html2canvas(frameRef.current, {
        // scale 옵션 제거 → 화면에 보이는 크기 그대로 캡처
        useCORS: true,
        allowTaint: false,
      });
      const dataUrl = canvas.toDataURL("image/jpeg");
      const responseFetch = await fetch(dataUrl);
      const blob = await responseFetch.blob();
      const file = new File([blob], "photo-frame.jpg", { type: blob.type });
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch("http://3.35.236.198:9000/api/photos/upload", {
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

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="photo-selection-container">
          {/* 왼쪽 3x3 그리드 */}
          <div className="photo-grid">
            {Array.from({ length: 9 }).map((_, idx) => {
              if (idx === 8) {
                return (
                  <div className="photo-cell photo-count" key={idx}>
                    {`${selectedPhotoIndices.length} / 4`}
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

          {/* 오른쪽 프레임 영역 */}
          <div className="photo-frame-container">
            <div className="photo-frame-wrapper">
              <PhotoFrame
                ref={frameRef}
                selectedPhotos={selectedPhotoIndices.map((i) => photos[i])}
                hideArrows={captureMode}
              />
            </div>
            <div className="print-button-area">
              <button onClick={handlePrint} className="print-button" disabled={selectedPhotoIndices.length !== 4}>
                인쇄하기
              </button>
            </div>
          </div>
        </div>
      </Largemain>
    </Background>
  );
};

export default PhotoSelectionPage;
