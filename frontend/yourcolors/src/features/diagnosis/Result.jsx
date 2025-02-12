import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import SmallMain from "../../background/background/SmallMain";
import LargeMain from "../../background/background/LargeMain";
import LeftRightButton from "../../button/left-right-button/LeftRightButton"; // 🔹 추가
import "./Result.css";

import personalColorInfo from "../../store/PersonalColorInfo"; // 정적 객체 데이터
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터
import Largemain from '../../background/background/LargeMain';

const Result = () => {
  const navigate = useNavigate(); // 🔹 네비게이션 훅 추가
  // const personalId = 1;
  const { userPersonalId, personalColorDetails, Results } = useStore();
  
  console.log("본인 결과 확인 => ", Results);
  // console.log("확인 작업2 ㅡㅡ", personalColorDetails);

  // useEffect(() => {
  //   // 컴포넌트가 렌더링될 때 API 호출하여 상세 정보 가져오기
  //   fetchPersonalColorDetails(userPersonalId);
  // }, [userPersonalId, fetchPersonalColorDetails]);

  // const location = useLocation();


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

  // mainColor에 해당하는 이미지 URL 가져오기
  const imageUrl = personalColorInfo[userPersonalId].characterUrl // 일단 1번 봄라이트 이미지로...

  const handleRightClick = () => {
    navigate("/personalcolors/12");
  };

  return (
      <SmallMain>
        <div className="container-left">
          <div className="container-up">
            <div className="title-main">당신의 퍼스널컬러는</div>
            <strong className="main-color">{personalColorDetails.name}</strong>
          </div>

          <div className="container-center">
            <div className="summary">{personalColorDetails.description}</div>
          {Array.isArray(personalColorDetails.hashtag) ? personalColorDetails.hashtag.join(" ") : ""}
          </div>

          <div className="container-down">
            <div className="title-sub">서브컬러</div>
          {/* <strong className="sub-color">{subColors.join(" & ")}</strong> */}
          <strong className="sub-color">{Results[1].personal_color} & {Results[2].personal_color}</strong>
          </div>
        
        </div>

        {/* 이미지 컨테이너 (우측 정렬) */}
        <div className="image-container">
          <div className="personal-character-image">
            <img src={imageUrl} alt={mainColor} />
          </div>
        </div>

      </SmallMain>


  );
};

export default Result;
