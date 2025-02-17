import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import PhotoFrame from "./PhotoFrame";
import useStore from "../../store/UseStore"; // Zustand 상태관리 사용 (필요시 활용)
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiBaseUrl = "https://i12e106.p.ssafy.io";

const PhotoSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photos } = location.state || { photos: [] };
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [num, setNum] = useState(0); // 현재 표시할 퍼스널 컬러 인덱스

  // 사진 클릭 시 선택/해제 토글 (최대 4장 선택)
  const toggleSelectPhoto = (photo) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== photo));
    } else {
      if (selectedPhotos.length < 4) {
        setSelectedPhotos([...selectedPhotos, photo]);
      }
    }
  };

  // 인쇄하기 버튼 클릭 시: 선택된 사진을 업로드 후 QR 코드 페이지로 이동
  const handlePrint = async () => {
    if (selectedPhotos.length < 1) {
      alert("적어도 한 장의 사진을 선택해주세요.");
      return;
    }

    try {
      const fileUrl = selectedPhotos[0];
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const file = new File([blob], "photo.jpg", { type: blob.type });

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
      navigate("/qr-code", { state: { qrCodeUrl: data.qr_code_url } });
    } catch (error) {
      console.error(error);
      alert("인쇄 처리 중 오류가 발생했습니다.");
    }
  };

  // 모달에서 이전/다음 디자인 선택
  const nextNum = () => {
    setNum((num) => (num + 1 + 12) % 12);
  };
  const prevNum = () => {
    setNum((num) => (num - 1 + 12) % 12);
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(3, 1fr)",
                gap: "5px", // 간격 줄이기
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
                        width: "90%", // 크기 줄이기
                        height: "90%",
                      }}
                    >
                      {`${selectedPhotos.length} / 4`}
                    </div>
                  );
                }
                const photo = photos[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => photo && toggleSelectPhoto(photo)}
                    style={{
                      position: "relative",
                      cursor: photo ? "pointer" : "default",
                      border:
                        photo && selectedPhotos.includes(photo)
                          ? "2px solid blue"
                          : "1px solid #aaa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      width: "90%", // 크기 줄이기
                      height: "90%",
                    }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={`사진 ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>빈 사진</span>
                    )}
                    {photo && selectedPhotos.includes(photo) && (
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
          <PhotoFrame selectedPhotos={selectedPhotos} num={num} />
        </div>
        {selectedPhotos.length === 4 && (
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
