import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useNavigate } from "react-router-dom";
import QrImage from "../../images/qr_code.png"; // QR 코드 이미지
import PhotoBoothImage from "../../images/photo_booth.png"; // 인생네컷 사진 예시 이미지
import TwoFrame from "../../images/twoframe.png"; // 인생네컷 사진 예시 이미지
import FourFrame from "../../images/fourframe.png"; // 인생네컷 사진 예시 이미지
import "../start/MainPage.css";
import "./PhotoQrChoicePage.css";

const PhotoQrChoicePage = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="choice-container">
          {/* QR코드 촬영 버튼 */}
          <div className="choice-card blue-bg" onClick={() => navigate("/select")}> 
            <div className="qrchoice-ai-image-wrapper">
              <img src={QrImage} alt="QR 코드" className="choice-image" />
            </div>
            <div className="qrchoice-content" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="qrchoice-img" style={{ flex: '1' }}>
                <img src={FourFrame} alt="실물 사진" className="frame-image" />
              </div>
              <div className="qrchoice-text" style={{ flex: '2' }}>
                <p className="qrchoice-description">
                  <br />
                  <strong>4칸 프레임</strong>으로 계절네컷 촬영 후 <br /><br />
                  <strong>QR 코드</strong>로 받아보세요! <br />
                </p>
              </div>
            </div>
            <div className="qrchoice-footer blue-footer">QR 코드로 받기</div>
          </div>
          
          {/* 실물 사진 촬영 버튼 */}
          <div className="choice-card red-bg" onClick={() => navigate("/selecttwo")}> 
            <div className="qrchoice-color-image-wrapper">
              <img src={PhotoBoothImage} alt="실물 사진" className="choice-image" />
            </div>
            <div className="qrchoice-content" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="qrchoice-img" style={{ flex: '1' }}>
                <img src={TwoFrame} alt="실물 사진" className="frame-image2" />
              </div>
              <div className="qrchoice-text" style={{ flex: '2' }}>
                <p className="qrchoice-description2">
                  <br />
                  <strong>2칸 프레임</strong>으로 계절네컷 촬영 후 <br /><br />
                  <strong>포토 카드</strong>로 받아보세요!
                </p>
              </div>
            </div>
            <div className="qrchoice-footer red-footer">포토 카드 출력</div>
          </div>
        </div>
      </Largemain>
    </Background>
  );
};

export default PhotoQrChoicePage;
