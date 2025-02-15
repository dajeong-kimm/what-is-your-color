import React, { useState } from "react";
import personalColorInfo from "../../store/PersonalColorInfo"; 
import useStore from "../../store/UseStore"; // Zustand 상태관리 사용 (필요시 활용)

const PhotoFrame = ({ selectedPhotos = [] }) => {
  const totalDesigns = 12; // 총 프레임 수 (1~12)
  const { userPersonalId } = useStore();
  const initialIndex =
    Number(userPersonalId) >= 1 && Number(userPersonalId) <= totalDesigns
      ? Number(userPersonalId)
      : 1;
  const [num, setNum] = useState(initialIndex); // 현재 표시할 퍼스널 컬러 디자인 번호 (1~12)

  const nextNum = () => {
    setNum((prev) => (prev === totalDesigns ? 1 : prev + 1));
  };

  const prevNum = () => {
    setNum((prev) => (prev === 1 ? totalDesigns : prev - 1));
  };

  return (
    <div
      className="photo-booth-container"
      style={{ display: "flex", top : "1%",justifyContent: "center", position: "relative" }}
    >
      {/* 왼쪽 화살표 버튼 */}
      <button
        onClick={prevNum}
        style={{
          position: "absolute",
          left: "-30px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          fontSize: "2rem",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        &#9664;
      </button>

      {/* PhotoFrame 영역 */}
      <div
        className="photo-booth"
        style={{
          border: `8px solid ${personalColorInfo[num].background_color}`,
          padding: "8px",
          backgroundColor: personalColorInfo[num].background_color,
          display: "flex",
          flexDirection: "column",
          margin: "50px",
          alignItems: "center",
          gap: "10px",
          width: "9.5rem",
          position: "relative",
          height: "75%",
          zIndex: 2,
        }}
      >
        {/* 양옆 텍스트 */}
        <div
          className="side-text"
          style={{
            position: "absolute",
            left: "-10px",
            top: "25%",
            transform: "translateY(-50%)",
            writingMode: "sideways-lr",
            color: "white",
            fontSize: "9px",
            fontWeight: "bold",
          }}
        >
          your colors
        </div>
        <div
          className="side-text"
          style={{
            position: "absolute",
            right: "-10px",
            top: "25%",
            transform: "translateY(-50%)",
            writingMode: "sideways-rl",
            color: "white",
            fontSize: "9px",
            fontWeight: "bold",
          }}
        >
          your colors
        </div>
        <div
          className="side-text"
          style={{
            position: "absolute",
            left: "-10px",
            bottom: "35%",
            transform: "translateY(-50%)",
            writingMode: "sideways-lr",
            color: "white",
            fontSize: "9px",
            fontWeight: "bold",
          }}
        >
          your colors
        </div>
        <div
          className="side-text"
          style={{
            position: "absolute",
            right: "-10px",
            bottom: "35%",
            transform: "translateY(-50%)",
            writingMode: "sideways-rl",
            color: "white",
            fontSize: "9px",
            fontWeight: "bold",
          }}
        >
          your colors
        </div>
        
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="photo-slot"
            style={{
              width: "100%",
              aspectRatio: "16/9",
              backgroundColor: "white",
              border: `4px solid ${personalColorInfo[num].background_color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40px",
              height : "20%",
              position: "relative",
              zIndex: 5,
            }}
          >
            {selectedPhotos[idx] ? (
              <img
                src={selectedPhotos[idx]}
                alt={`선택된 사진 ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", zIndex: 3 }}
              />
            ) : (
              <span style={{ fontSize: "10px", visibility: "hidden" }}>빈 슬롯</span>
            )}
            {idx === 1 && (
              <img
                src={personalColorInfo[num].characterWomanUrl}
                alt="Character Woman"
                style={{ position: "absolute", left: "0px", height: "90%" ,top:"10px", zIndex: 5 }}
              />
            )}
            {idx === 3 && (
              <img
                src={personalColorInfo[num].characterManUrl}
                alt="Character Man"
                style={{ position: "absolute", right: "0px", height: "90%",top:"10px", zIndex: 4 }}
              />
            )}
          </div>
        ))}
        <div
          className="photo-booth-footer"
          style={{ textAlign: "center", marginTop: "20px", color: "white", width: "100%", padding: "10px 0" }}
        >
          <div
            className="photo-booth-text"
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "cursive",
              fontStyle: "italic",
              marginTop: "-38px",
            }}
          >
            {personalColorInfo[num].colorClass}
          </div>
          <div className="photo-booth-text" style={{ fontSize: "23px", fontWeight: "bold" ,marginBottom:"-20px"}}>
            계절네컷
          </div>
        </div>
      </div>
      {/* 오른쪽 화살표 버튼 */}
      <button
        onClick={nextNum}
        style={{
          position: "absolute",
          right: "-30px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          fontSize: "2rem",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        &#9654;
      </button>
    </div>
  );
};

export default PhotoFrame;
