import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"; // URL에서 퍼스널컬러 가져오기
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터터
import Background from "../../background/background/Background";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import BottomBarPersonal from "../../button/bottom/BottomBarPersonal"
import PersonalColorDetailContent from "./PersonalColorDetailContent";
import LeftRightButton from "../../button/left-right-button/LeftRightButton"; // 🔹 추가
import personalColorInfo from "../../store/PersonalColorInfo"; // 정적 객체 데이터
import SmallMain from "../../background/background/SmallMain";

import "./PersonalButton.css";
import "./PersonalColorDetail.css";


const PersonalColorDetail = () => {
  const { id } = useParams();
  const { personalColors, fetchPersonalColors } = useStore();
  const [loading, setLoading] = useState(true);


  // 🔹 데이터가 없으면 API 다시 호출
  useEffect(() => {
    if (personalColors.length === 0) {
      setLoading(true);  // 로딩 시작
      fetchPersonalColors().then(() => setLoading(false)); // 데이터 가져오면 로딩 끝
    } else {
      setLoading(false);
    }
  }, [personalColors, fetchPersonalColors]);


  // 🔹 로딩 중일 때 메시지 표시
  if (loading) {
    return <h2>로딩 중...</h2>;
  }

  // 🔹 데이터가 없을 때 메시지 표시
  if (!personalColors[id-1]) {
    return <h2>해당 퍼스널컬러 정보를 찾을 수 없습니다.</h2>;
  }

  // description에서 \n을 <br />로 바꾸는 함수
  // const formatDescription = (description) => {
  //   return description.split("\n").map((str, index) => (
  //     <span key={index}>{str}<br /></span>
  //   ));
  // };
  // console.log(colorInfo)

  return (
    <Background>
      <Topbar />
      {/* <PersonalColorDetailContent /> */}
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
    <BottomBarPersonal />
    </Background>
  );
};

export default PersonalColorDetail;
