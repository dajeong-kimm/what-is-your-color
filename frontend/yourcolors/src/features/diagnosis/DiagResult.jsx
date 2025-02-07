import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Background from "../../background/background/BackGround";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import "./DiagResult.css";

import personalColors from "../../data/PersonalColors";
import useStore from '../../store/useStore'; //Zustand 상태관리 데이터터

const colorImageMap = {
  "봄 라이트": "spring-light",
  "봄 브라이트": "spring-bright",
  "봄 비비드": "spring-vivid",
  "여름 라이트": "summer-light",
  "여름 브라이트": "summer-bright",
  "여름 뮤트": "summer-mute",
  "가을 뮤트": "autumn-mute",
  "가을 스트롱": "autumn-strong",
  "가을 다크": "autumn-dark",
  "겨울 비비드": "winter-vivid",
  "겨울 스트롱": "winter-strong",
  "겨울 다크": "winter-dark",
};

const DiagResult = () => {
  const personalId = 1;
  const { fetchPersonalColorDetails } = useStore();

  useEffect(() => {
    // 컴포넌트가 렌더링될 때 API 호출하여 상세 정보 가져오기
    fetchPersonalColorDetails(1);
  }, [personalId, fetchPersonalColorDetails]);



  const location = useLocation();

  // 🔹 백엔드 연동 시 사용 (현재 주석 처리)
  // const { mainColor, subColors } = location.state || {};

  // 🔹 임시 예시 데이터
  const exampleData = {
    mainColor: "겨울 다크",
    subColors: ["가을 다크", "겨울 스트롱"],
    summary: "모던함의 인간화",
    hashtags: ["#차가운", "#시크한","#카리스마"],
  };

  // 백엔드 연결 후 exampleData 부분 삭제 가능
  const mainColor = exampleData.mainColor; // location.state?.mainColor || exampleData.mainColor
  const subColors = exampleData.subColors; // location.state?.subColors || exampleData.subColors
  const summary = exampleData.summary;
  const hashtags = exampleData.hashtags;

  // 이미지 파일명 변환
  // const imageFileName = colorImageMap[mainColor] || "default"; // 매칭되는 이미지 없으면 default.png 사용
  // 배열을 객체(Map) 형태로 변환
  const colorMap = personalColors.reduce((acc, color) => {
    acc[color.name] = color.characterUrl;
    return acc;
  }, {});

  // mainColor에 해당하는 이미지 URL 가져오기
  const imageUrl = colorMap[mainColor] || "기본 이미지 URL";

  return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="container-left">

          <div className="container-up">
            <div className="title-main">당신의 퍼스널컬러는</div>
            <strong className="main-color">{mainColor}</strong>
          </div>

          <div className="container-center">
            <div className="summary">{summary}</div>
            <div className="hashtag">{hashtags.join(" ")}</div>
          </div>

          <div className="container-down">
            <div className="title-sub">서브컬러</div>
            <strong className="sub-color">{subColors.join(" & ")}</strong>
          </div>
        
        </div>

        {/* 이미지 컨테이너 (우측 정렬) */}
        <div className="image-container">
          <div className="personal-character-image">
            <img src={imageUrl} alt={mainColor} />
          </div>
        </div>
      </SmallMain>
      <Bottombar />
    </Background>
  );
};

export default DiagResult;
