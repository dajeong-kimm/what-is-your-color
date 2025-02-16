import React, { useState } from "react";
import personalColorInfo from "../../store/PersonalColorInfo";
import useStore from "../../store/UseStore";

// 화살표: hideArrows
// 옆으로 누운 텍스트: transform rotate
const PhotoFrame = React.forwardRef(({ selectedPhotos = [], hideArrows = false }, ref) => {
  const totalDesigns = 12;
  const { userPersonalId } = useStore();
  const initialIndex =
    Number(userPersonalId) >= 1 && Number(userPersonalId) <= totalDesigns ? Number(userPersonalId) : 1;
  const [num, setNum] = useState(initialIndex);

  const nextNum = () => {
    setNum((prev) => (prev === totalDesigns ? 1 : prev + 1));
  };

  const prevNum = () => {
    setNum((prev) => (prev === 1 ? totalDesigns : prev - 1));
  };

  // 옆으로 누운 텍스트를 만들기 위한 공통 스타일
  const sideTextStyle = {
    position: "absolute",
    fontSize: "9px",
    fontWeight: "bold",
    color: "white",
    // 회전축을 왼쪽 상단(또는 적절한 위치)으로
    transformOrigin: "center center",
  };

  return (
    <div
      ref={ref}
      className="photo-booth-container"
      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* 화살표 버튼은 hideArrows가 false일 때만 렌더링 */}
      {!hideArrows && (
        <>
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
        </>
      )}

      {/* PhotoFrame 영역 */}
      <div
        className="photo-booth"
        style={{
          border: `8px solid ${personalColorInfo[num].background_color}`,
          padding: "8px",
          backgroundColor: personalColorInfo[num].background_color,
          display: "flex",
          flexDirection: "column",
          // margin: "50px",
          alignItems: "center",
          gap: "10px",
          width: "13rem",
          position: "relative",
          height: "100%",
          zIndex: 2,
        }}
      >
        {/* 왼쪽 텍스트 (위쪽) */}
        <div
          style={{
            ...sideTextStyle,
            left: "-25px",
            top: "25%",
            transform: "rotate(-90deg)",
          }}
        >
          your colors
        </div>

        {/* 오른쪽 텍스트 (위쪽) */}
        <div
          style={{
            ...sideTextStyle,
            right: "-25px",
            top: "25%",
            transform: "rotate(90deg)",
          }}
        >
          your colors
        </div>

        {/* 왼쪽 텍스트 (아래) */}
        <div
          style={{
            ...sideTextStyle,
            left: "-25px",
            bottom: "35%",
            transform: "rotate(-90deg)",
          }}
        >
          your colors
        </div>

        {/* 오른쪽 텍스트 (아래) */}
        <div
          style={{
            ...sideTextStyle,
            right: "-25px",
            bottom: "35%",
            transform: "rotate(90deg)",
          }}
        >
          your colors
        </div>

        {/* 사진 슬롯 4개 */}
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              width: "100%",
              aspectRatio: "16/9",
              backgroundColor: "white",
              border: `4px solid ${personalColorInfo[num].background_color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40px",
              height: "20%",
              position: "relative",
              zIndex: 5,
            }}
          >
            {selectedPhotos[idx] ? (
              <img
                src={selectedPhotos[idx]}
                alt={`선택된 사진 ${idx + 1}`}
                crossOrigin="anonymous"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 3,
                }}
              />
            ) : (
              <span style={{ fontSize: "10px", visibility: "hidden" }}>빈 슬롯</span>
            )}
            {/* 2번째 칸(인덱스 1)에 캐릭터(여) */}
            {idx === 1 && (
              <img
                src={personalColorInfo[num].characterWomanUrl}
                alt="Character Woman"
                crossOrigin="anonymous"
                style={{
                  position: "absolute",
                  left: "0px",
                  height: "40%",
                  top: "60%",
                  zIndex: 5,
                }}
              />
            )}
            {/* 4번째 칸(인덱스 3)에 캐릭터(남) */}
            {idx === 3 && (
              <img
                src={personalColorInfo[num].characterManUrl}
                alt="Character Man"
                crossOrigin="anonymous"
                style={{
                  position: "absolute",
                  right: "0px",
                  height: "40%",
                  top: "60%",
                  zIndex: 4,
                }}
              />
            )}
          </div>
        ))}

        {/* 프레임 하단 텍스트 */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "white",
            width: "100%",
            padding: "10px 0",
          }}
        >
          <div
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
          <div
            style={{
              fontSize: "23px",
              fontWeight: "bold",
              marginBottom: "-20px",
            }}
          >
            계절네컷
          </div>
        </div>
      </div>
    </div>
  );
});

export default PhotoFrame;
