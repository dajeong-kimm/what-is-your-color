import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import PhotoFrame from "./PhotoFrame";
import html2canvas from "html2canvas";
import useStore from "../../store/UseStore";

const PhotoSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photos } = location.state || { photos: [] };
  const [selectedPhotoIndices, setSelectedPhotoIndices] = useState([]);
  // 인터랙티브 뷰에서 캡쳐 시에는 captureMode 상태로 hideArrows 여부를 제어합니다.
  const [captureMode, setCaptureMode] = useState(false);
  const frameRef = useRef(null);

  // 사진 클릭 시 선택/해제 (최대 4장 선택)
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

  // 인쇄 버튼 클릭 시 QR 코드용 이미지를 캡쳐
  const handlePrint = async () => {
    if (selectedPhotoIndices.length < 1) {
      alert("적어도 한 장의 사진을 선택해주세요.");
      return;
    }
    // 캡쳐 전에 hideArrows를 true로 설정 (즉, 캡쳐용 뷰로 전환)
    setCaptureMode(true);

    // 리렌더링 대기 (필요 시 setTimeout이나 requestAnimationFrame 사용)
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(frameRef.current, {
        scale: 2,
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
      navigate("/qr-code", { state: { qrCodeUrl: data.qr_code_url } });
    } catch (error) {
      console.error(error);
      alert("인쇄 처리 중 오류가 발생했습니다.");
    } finally {
      // 캡쳐 후 원래 상태로 복원 (인터랙티브 뷰에서는 화살표 표시)
      setCaptureMode(false);
    }
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(3, 1fr)",
                gap: "5px",
              }}
            >
              {Array.from({ length: 9 }).map((_, idx) => {
                if (idx === 8) {
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #aaa",
                        fontSize: "18px",
                        backgroundColor: "#f0f0f0",
                        width: "90%",
                        height: "90%",
                      }}
                    >
                      {`${selectedPhotoIndices.length} / 4`}
                    </div>
                  );
                }
                const photo = photos[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSelectPhoto(idx)}
                    style={{
                      position: "relative",
                      cursor: photo ? "pointer" : "default",
                      border: photo && selectedPhotoIndices.includes(idx) ? "2px solid blue" : "1px solid #aaa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      width: "90%",
                      height: "90%",
                    }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={`사진 ${idx + 1}`}
                        crossOrigin="anonymous"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>빈 사진</span>
                    )}
                    {photo && selectedPhotoIndices.includes(idx) && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.3)",
                        }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* 인터랙티브 뷰에서는 화살표 보이도록 hideArrows는 captureMode 상태에 따라 결정 */}
          <PhotoFrame
            ref={frameRef}
            selectedPhotos={selectedPhotoIndices.map((i) => photos[i])}
            hideArrows={captureMode} // 캡쳐 중일 때는 true, 아닐 때는 false
            captureMode={captureMode}
          />
        </div>
        {selectedPhotoIndices.length === 4 && (
          <button
            onClick={handlePrint}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            인쇄하기
          </button>
        )}
      </Largemain>
    </Background>
  );
};

export default PhotoSelectionPage;
