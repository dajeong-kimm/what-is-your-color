import React, { useEffect,useState  } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import SmallMain from "../../background/background/SmallMain";
import personalColorInfo from "../../store/PersonalColorInfo"; // 정적 객체 데이터
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터

import "./Result.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Result = () => {

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
    // const personalId = 1;
  const { userPersonalId, personalColorDetails, Results } = useStore();
  
  console.log("본인 결과 확인 => ", Results);
  // console.log("확인 작업2 ㅡㅡ", personalColorDetails);

  // useEffect(() => {
  //   // 컴포넌트가 렌더링될 때 API 호출하여 상세 정보 가져오기
  //   fetchPersonalColorDetails(userPersonalId);
  // }, [userPersonalId, fetchPersonalColorDetails]);

  // const location = useLocation();


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
  const imageUrl = personalColorInfo[userPersonalId].characterUrl
  
  return (
    <SmallMain>
      <div className="container-left">
        <div className="container-up">
          <div className="title-main">🌈 당신의 퍼스널컬러는 ? 🔍</div>
          <strong className="main-color">{personalColorDetails.name}</strong>
        </div>
  
        <div className="container-center">
          <div className="summary">
            <strong>{personalColorDetails.description}</strong>
          </div>
          <div className="result-hashtag">
            {Array.isArray(personalColorDetails.hashtag) ? personalColorDetails.hashtag.join(" ") : " "}
          </div>
        </div>
  
        {/* 원래 코드 <div className="container-down">
          <strong className="sub-color">
            Sub color {Results[1].personal_color} & {Results[2].personal_color}
          </strong>
        </div> */}

        {/* 방법 1. 색상 카드로 <div className="container-down">
            <div className="sub-color-title">Sub Colors</div>
  <div className="sub-color-card">
    <strong>{Results[1].personal_color}</strong>
  </div>
  <div className="sub-color-card">
    <strong>{Results[2].personal_color}</strong>
  </div>
</div> */}

{/* <div className="container-down">
  <div className="sub-color-card tooltip">
    <strong>{Results[1].personal_color}</strong>
    <span className="tooltiptext">Sub Color</span>
  </div>
  <div className="sub-color-card tooltip">
    <strong>{Results[2].personal_color}</strong>
    <span className="tooltiptext">Sub Color</span>
  </div>
</div> */}
{/* 방법 3. i 아이콘 누르면 뜨게 <div className="container-down">
  <div className="sub-color-section">
    <div className="sub-color-card" >
      <strong>{Results[1].personal_color}</strong>
    </div>
    <i className="fa fa-info-circle" onClick={() => alert('Sub Color: ' + Results[1].personal_color)}></i>
  </div>
  <div className="sub-color-section">
    <div className="sub-color-card">
      <strong>{Results[2].personal_color}</strong>
    </div>
    <i className="fa fa-info-circle" onClick={() => alert('Sub Color: ' + Results[2].personal_color)}></i>
  </div>
</div> */}

{/* <div className="container-down">
  <div className="sub-color-card" onClick={(e) => e.currentTarget.classList.toggle('expanded')}>
    <strong>{Results[1].personal_color}</strong>
  </div>
  <div className="sub-color-card" onClick={(e) => e.currentTarget.classList.toggle('expanded')}>
    <strong>{Results[2].personal_color}</strong>
  </div>
</div> */}

{/* <div className="container-down">
  <div className="sub-color">
    <i className="fa fa-paint-brush"></i>
    {Results[1].personal_color}
  </div>
  <div className="sub-color">
    <i className="fa fa-paint-brush"></i>
     {Results[2].personal_color}
  </div>
</div> */}

<div className="container-down">
          <div className="sub-color-section" onClick={toggleExpand}>
            <i className="fa fa-info-circle"></i>
            <span>나의 서브컬러는?</span>
          </div>
          {expanded && (
            <div className="sub-colors-container">
              <div className="sub-color-card">
                <strong>{Results[1].personal_color}</strong>
                <div className="sub-color-summary">
                  <p>귀여움의 인간화</p>
                  <p>#귀염뽀짝 #단아한</p>
                </div>
              </div>
              <div className="sub-color-card">
                <strong>{Results[2].personal_color}</strong>
                <div className="sub-color-summary">
                  <p>차분함의 인간화</p>
                  <p>#단정한 #따뜻한</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* 이미지 컨테이너 (우측 정렬) */}
      <div className="image-container">
        <div className="personal-character-image">
          <img src={imageUrl} alt={personalColorDetails.name} />
        </div>
      </div>
    </SmallMain>
  );
}
  export default Result;
  