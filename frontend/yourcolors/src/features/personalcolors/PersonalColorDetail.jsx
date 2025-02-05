import React from "react";
import Background from "../../background/background/BackGround";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import "./personalbutton.css";
import "./PersonalColorDetail.css";
import { useParams } from "react-router-dom";
import personalColors from "../../data/PersonalColors";

import dummyData from "../../data/dummy-data";

const PersonalColorDetail = () => {
  const { id } = useParams();
  const colorInfo = dummyData.find((color) => color.id === parseInt(id));

  if (!colorInfo) {
    return <h2>해당 퍼스널컬러 정보를 찾을 수 없습니다.</h2>;
  }

  const { name, hashtags, description, imageUrl } = colorInfo;


  return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="personal-detail-container-left">
          {/* 상단 타이틀 */}
          <h1 className="personal-detail-title">{colorInfo.name}</h1>
          {/* 색상 이미지 */}
          <div className="personal-detail-image">
            <img src={imageUrl} alt={name} />
          </div>
        </div>  

        <div className="personal-detail-container-right">
          {/* 해시태그 */}
          <div className="personal-detail-hashtags">
            {hashtags.map((tag, index) => (
              <span key={index} className="hashtag">
                #{tag}
              </span>
            ))}
          </div>

          {/* 상세 설명 */}
          <div className="personal-detail-content">
            <div className="personal-detail-description">
              <p>{description}</p>
            </div>
          </div>
        </div>

          
        
      </SmallMain>
      <Bottombar />
    </Background>
  );
};

export default PersonalColorDetail;
