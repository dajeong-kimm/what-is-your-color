import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import PhotoFrameTwo from "./PhotoFrameTwo";
import useStore from "../../store/UseStore"; // Zustand 상태관리 사용 (필요시 활용)

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

  // 인쇄하기 버튼 클릭 시: 선택된 사진을 이메일로 전송
  const handlePrint = async () => {
    if (selectedPhotos.length < 1) {
      alert("적어도 한 장의 사진을 선택해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      
      for (let i = 0; i < selectedPhotos.length; i++) {
        const fileUrl = selectedPhotos[i];
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const file = new File([blob], `photo_${i + 1}.jpg`, { type: blob.type });

        formData.append(`file${i + 1}`, file);
      }

      // 수신 이메일 추가
      formData.append("email", "poem1999515@naver.com");

      // 이메일 전송 API 요청
      const emailResponse = await fetch("http://3.35.236.198:9000/api/send-email", {
        method: "POST",
        body: formData,
      });

      if (!emailResponse.ok) {
        alert("이메일 전송에 실패했습니다.");
        return;
      }

      alert("이메일이 성공적으로 전송되었습니다!");
    } catch (error) {
      console.error(error);
      alert("이메일 전송 중 오류가 발생했습니다.");
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
                      {`${selectedPhotos.length} / 2`}
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
                      border: photo && selectedPhotos.includes(photo)
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
          <PhotoFrameTwo selectedPhotos={selectedPhotos} num={num} />
        </div>
        {selectedPhotos.length === 2 && (
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
