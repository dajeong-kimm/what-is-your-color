import React from "react";
import personalColorInfo from "../../store/PersonalColorInfo";

const PhotoFrame = React.forwardRef(
  (
    { selectedPhotos = [], hideArrows = false, designNum, onNextDesign, onPrevDesign },
    ref
  ) => {
    // 부모에서 전달받은 designNum 사용 (없으면 기본값 1 사용)
    const num = designNum || 1;

    // 옆으로 누운 텍스트 공통 스타일
    const sideTextStyle = {
      position: "absolute",
      fontSize: "9px",
      fontWeight: "bold",
      color: "white",
      transformOrigin: "center center",
    };

    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* 화살표 버튼 (hideArrows=false일 때만) */}
        {!hideArrows && (
          <>
            <button
              onClick={onPrevDesign}
              style={{
                position: "absolute",
                left: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                zIndex: 10,
                color: "#333",
              }}
            >
              &#9664;
            </button>
            <button
              onClick={onNextDesign}
              style={{
                position: "absolute",
                right: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                zIndex: 10,
                color: "#333",
              }}
            >
              &#9654;
            </button>
          </>
        )}

        {/* 네컷 프레임 영역 */}
        <div
          style={{
            border: `8px solid ${personalColorInfo[num].background_color}`,
            padding: "8px",
            backgroundColor: personalColorInfo[num].background_color,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "11px",
            width: "10rem",
            height: "600px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* 옆으로 누운 텍스트들 */}
          <div
            style={{
              ...sideTextStyle,
              left: "-27px",
              top: "25%",
              transform: "rotate(-90deg)",
            }}
          >
            your colors
          </div>
          <div
            style={{
              ...sideTextStyle,
              right: "-27px",
              top: "25%",
              transform: "rotate(90deg)",
            }}
          >
            your colors
          </div>
          <div
            style={{
              ...sideTextStyle,
              left: "-27px",
              bottom: "35%",
              transform: "rotate(-90deg)",
            }}
          >
            your colors
          </div>
          <div
            style={{
              ...sideTextStyle,
              right: "-27px",
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
                flex: 1,
                width: "100%",
                backgroundColor: "white",
                border: `4px solid ${personalColorInfo[num].background_color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "40px",
                position: "relative",
                overflow: "hidden",
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
                    objectFit: "contain",
                    zIndex: 3,
                  }}
                />
              ) : (
                <span style={{ fontSize: "10px", visibility: "hidden" }}>
                  빈 슬롯
                </span>
              )}
              {/* 2번째 슬롯에 캐릭터(여) */}
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
              {/* 4번째 슬롯에 캐릭터(남) */}
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
  }
);

export default PhotoFrame;
