// QrCodePage.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";

const QrCodePage = () => {
  const location = useLocation();
  const { qrCodeUrl } = location.state || {};

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {qrCodeUrl ? (
            <>
              <h2>QR 코드</h2>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                style={{ maxWidth: "100%", maxHeight: "80%" }}
              />
            </>
          ) : (
            <p>QR 코드가 생성되지 않았습니다.</p>
          )}
        </div>
      </Largemain>
    </Background>
  );
};

export default QrCodePage;
