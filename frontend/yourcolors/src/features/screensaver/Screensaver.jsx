import React from "react";
import { useInactivity } from "../../hooks/InactivityContext";
import screensaverVideo from "../../images/screensaver.mp4";
import screensaverGif from "../../images/taeyeon_ad.gif";

function Screensaver({ children }) {
  const { isInactive } = useInactivity();

  if (isInactive) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999, // 가장 위에 오도록
        }}
      >
        {/* 여기 원하는 디자인/애니메이션을 넣어도 됨 */}
        {/* <h1>화면보호기 동작 중...</h1> */}
        <video
          autoPlay
          loop
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={screensaverVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "1.5rem",
              textAlign: "center",
              padding: "1rem",
              // backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              borderRadius: "8px",
            }}
          >
            체험을 하시려면 화면을 터치해주세요
          </div>
        {/* <img
          src={screensaverGif}
          alt="Screensaver"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        /> */}
      </div>
    );
  }

  // 비활동 상태가 아니면 기존 화면(자식 요소) 표시
  return <>{children}</>;
}

export default Screensaver;
