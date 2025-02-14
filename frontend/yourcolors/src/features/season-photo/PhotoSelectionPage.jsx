import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useLocation } from "react-router-dom";
import PhotoFrame from "./PhotoFrame";
import useStore from "../../store/UseStore"; // Zustand 상태관리 사용 (필요시 활용)

const PhotoSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photos } = location.state || { photos: [] };
  const [selectedPhotos, setSelectedPhotos] = useState([]);

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
      // 여기서는 selectedPhotos의 첫 번째 사진을 업로드 대상으로 사용합니다.
      const fileUrl = selectedPhotos[0];
      // URL을 통해 blob을 가져와서 File 객체로 변환
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const file = new File([blob], "photo.jpg", { type: blob.type });
  
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
      // data 예시: { "qr_code_url": "http://.../api/photos/qrcode/photo.jpg", "file_url": "http://.../api/photos/download/photo.jpg" }
      // QR 코드 URL을 다음 페이지에 전달
      navigate("/qr-code", { state: { qrCodeUrl: data.qr_code_url } });
    } catch (error) {
      console.error(error);
      alert("인쇄 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        {/* Largemain 내부를 좌우 구역으로 분할 */}
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          {/* 왼쪽 구역: 촬영한 사진 그리드 (3 x 3) - 마지막 칸은 선택된 사진 수 표시 */}
          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(3, 1fr)",
                gap: "10px",
              }}
            >
              {Array.from({ length: 9 }).map((_, idx) => {
                // 마지막 칸: 선택한 사진 개수 표시
                if (idx === 8) {
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #aaa",
                        fontSize: "20px",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      {`${selectedPhotos.length} / 4`}
                    </div>
                  );
                }
                // 나머지 칸: 사진 출력 (photos 배열의 인덱스와 매핑)
                const photo = photos[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => photo && toggleSelectPhoto(photo)}
                    style={{
                      position: "relative",
                      cursor: photo ? "pointer" : "default",
                      border: photo && selectedPhotos.includes(photo)
                        ? "2px solid blue"
                        : "1px solid #aaa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
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
          {/* 오른쪽 구역: 인생네컷 프레임 (세로 4 슬롯) */}
          <div
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
