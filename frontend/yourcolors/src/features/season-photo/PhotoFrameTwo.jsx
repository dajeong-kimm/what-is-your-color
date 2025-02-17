import React from "react";
import personalColorInfo from "../../store/PersonalColorInfo";

const PhotoFrameTwo = React.forwardRef(
  ({ selectedPhotos = [], designNum, onNextDesign, onPrevDesign, hideArrows = false }, ref) => {
    const num = designNum || 1;

    return (
      <div
        style={{
          position: "relative",
          width: "fit-content",
        }}
      >
        <div
          ref={ref}
          style={{
            aspectRatio: "16/9",
            width: "10rem",
            height: "316px", // 원하는 높이 (예: 360px)
            border: `8px solid ${personalColorInfo[num].background_color}`,
            padding: "8px",
            backgroundColor: personalColorInfo[num].background_color,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-27px",
              top: "40%",
              transform: "translateY(-50%) rotate(-90deg)",
              // writingMode: "sideways-lr",
              transformOrigin: "center",
              color: "white",
              fontSize: "9px",
              fontWeight: "bold",
            }}
          >
            your colors
          </div>
          <div
            style={{
              position: "absolute",
              right: "-27px",
              top: "40%",
              transform: "translateY(-50%) rotate(90deg)",
              transformOrigin: "center",
              // writingMode: "sideways-rl",
              color: "white",
              fontSize: "9px",
              fontWeight: "bold",
            }}
          >
            your colors
          </div>

          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                width: "100%",
                aspectRatio: "16/9",
                backgroundColor: "white",
                border: `4px solid ${personalColorInfo[num].background_color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 5,
              }}
            >
              {selectedPhotos[idx] ? (
                <img
                  src={selectedPhotos[idx]}
                  alt={`선택된 사진 ${idx + 1}`}
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
              {idx === 0 && (
                <img
                  src={personalColorInfo[num].characterManUrl}
                  alt="Character Man"
                  style={{
                    position: "absolute",
                    right: "0px",
                    height: "40%",
                    top: "60%",
                    zIndex: 4,
                  }}
                />
              )}
              {idx === 1 && (
                <img
                  src={personalColorInfo[num].characterWomanUrl}
                  alt="Character Woman"
                  style={{
                    position: "absolute",
                    left: "0px",
                    height: "40%",
                    top: "60%",
                    zIndex: 5,
                  }}
                />
              )}
            </div>
          ))}

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

        {!hideArrows && (
          <>
            {/* 왼쪽 화살표: left 값만 -3rem으로 조정 */}
            <button
              onClick={onPrevDesign}
              style={{
                position: "absolute",
                left: "-5rem", // ← 간격을 좀 더 띄움
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

            {/* 오른쪽 화살표: right 값만 -3rem으로 조정 */}
            <button
              onClick={onNextDesign}
              style={{
                position: "absolute",
                right: "-5rem", // ← 간격을 좀 더 띄움
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
      </div>
    );
  }
);

export default PhotoFrameTwo;
