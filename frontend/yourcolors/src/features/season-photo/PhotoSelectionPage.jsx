import React, { useState } from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useLocation } from "react-router-dom";
import PhotoFrame from "./PhotoFrame";
import useStore from "../../store/UseStore"; // Zustand 상태관리 사용 (필요시 활용)

const PhotoSelectionPage = () => {
  const location = useLocation();
  const { photos } = location.state || { photos: [] };
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // 사진 클릭 시 선택/해제 토글
  const toggleSelectPhoto = (photo) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== photo));
    } else {
      if (selectedPhotos.length < 4) {
        setSelectedPhotos([...selectedPhotos, photo]);
      }
    }
  };

  const handlePrint = () => {
    // 인쇄하기 기능 구현 (필요시 Zustand나 API 연동)
    alert("인쇄하기 기능 실행");
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        {/* Largemain 내부를 좌우 구역으로 분할 */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          {/* 왼쪽 구역: 촬영한 사진 그리드 (4 x 2) */}
          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: "1px 5px", // 좌우 간격 줄이기 (위아래 유지)
              }}
            >
              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleSelectPhoto(photo)}
                  style={
                    {
                      position: "relative",
                      cursor: "pointer",
                      border: selectedPhotos.includes(photo)
                        ? "2px solid blue"
                        : "none",
                      width: "160px", // 사진 크기 유지
                      height: "90px", // 비율 유지
                    }
                  }
                >
                  <img
                    src={photo}
                    alt={`사진 ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {selectedPhotos.includes(photo) && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <PhotoFrame selectedPhotos={selectedPhotos} />
        </div>
        {/* {selectedPhotos.length === 4 && (
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
        )} */}
      </Largemain>
    </Background>
  );
};

export default PhotoSelectionPage;
