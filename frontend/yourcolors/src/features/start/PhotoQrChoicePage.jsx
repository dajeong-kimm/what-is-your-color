import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useNavigate } from "react-router-dom";
import QrImage from "../../images/qr_code.png"; // QR 코드 이미지
import PhotoBoothImage from "../../images/photo_booth.png"; // 인생네컷 사진 예시 이미지
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
          <div className="choice-card blue-bg" onClick={() => navigate("/scanqr")}> 
            <div className="choice-ai-image-wrapper">
              <img src={QrImage} alt="QR 코드" className="choice-image" />
            </div>
            <div className="choice-content">
              <h2 className="choice-title">QR 코드로 사진받기</h2>
              <p className="choice-description">
                QR 코드를 촬영하면 <strong>등록된 정보</strong>를 기반으로 <br />
                <strong>자동 분석</strong>을 진행하여 컬러를 진단합니다. <br />
                빠르고 간편한 방식으로 퍼스널컬러를 확인하세요!
              </p>
            </div>
            <div className="choice-footer blue-footer">QR 코드 인식</div>
          </div>

          {/* 실물 사진 촬영 버튼 */}
          <div className="choice-card red-bg" onClick={() => navigate("/capturephoto")}> 
            <div className="choice-color-image-wrapper">
              <img src={PhotoBoothImage} alt="실물 사진" className="choice-image" />
            </div>
            <div className="choice-content">
              <h2 className="choice-title">포토 카드 받기</h2>
              <p className="choice-description">
                직접 <strong>사진을 촬영</strong>하여 <br />
                얼굴과 피부 톤을 분석합니다. <br />
                <strong>A4 용지</strong>를 활용하면 더욱 정확한 컬러 진단이 가능합니다!
              </p>
            </div>
            <div className="choice-footer red-footer">사진 기반 분석</div>
          </div>
        </div>
      </Largemain>
    </Background>
  );
};

export default PhotoQrChoicePage;
