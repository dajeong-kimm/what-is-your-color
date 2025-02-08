import React, { useEffect, useState } from "react";
import SmallMain from "../../background/background/SmallMain";
import "./PersonalButton.css";
import "./PersonalColorDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import LeftRightButton from "../../button/left-right-button/LeftRightButton";

import useStore from "../../store/UseStore"; // Zustand 상태관리 데이터
import personalColorInfo from "../../store/PersonalColorInfo"; // 정적 객체 데이터

const PersonalColorDetailContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { personalColors, fetchPersonalColors } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (personalColors.length === 0) {
      setLoading(true);
      fetchPersonalColors().then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [personalColors, fetchPersonalColors]);

  if (loading) {
    return <h2>로딩 중...</h2>;
  }

  if (!personalColors[id - 1]) {
    return <h2>해당 퍼스널컬러 정보를 찾을 수 없습니다.</h2>;
  }

  const handleRightClick = () => {
    navigate("/bestworst");
  };

  const handleLeftClick = () => {
    navigate("/diagresult");
  };

  return (
    <SmallMain>
      <div className="personal-detail-container-left">
        {/* 상단 타이틀 */}
        <h1 className="personal-detail-title">{personalColors[id - 1].name}</h1>
        {/* 색상 이미지 */}
        <div className="personal-detail-image">
          <img
            src={personalColorInfo[id].imageUrl}
            alt={personalColors[id - 1].name}
          />
        </div>
      </div>

      <div className="personal-detail-container-right">
        {/* 해시태그 */}
        <div className="personal-detail-hashtags">
          {personalColors[id - 1].hashtag.map((tag, index) => (
            <span key={index} className="hashtag">
              {tag}
            </span>
          ))}
        </div>

        {/* 상세 설명 */}
        <div className="personal-detail-content">
          <div className="personal-detail-description">
            <p>{personalColorInfo[id].description}</p>
          </div>
        </div>
      </div>

    </SmallMain>
  );
};

export default PersonalColorDetailContent;
