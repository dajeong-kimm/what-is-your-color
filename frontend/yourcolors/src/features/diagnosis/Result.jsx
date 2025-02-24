import React, { useState } from "react";
import SmallMain from "../../background/background/SmallMain";
import personalColorInfo from "../../store/PersonalColorInfo"; // 정적 객체 데이터
import useStore from "../../store/UseStore"; //Zustand 상태관리 데이터
import "./Result.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Result = () => {
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 5000); // 5초 동안 팝업 표시
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

  // mainColor에 해당하는 이미지 URL 가져오기
  const imageUrl = personalColorInfo[userPersonalId].characterUrl;

  console.log(personalColorDetails.hashtag);
  console.log(Results[1]);
  return (
    <SmallMain>
      <div className="container-left">
        <div className="container-up">
          <div className="title-main">🌈 당신의 퍼스널컬러는 ?🔍</div>
          <strong className="main-color">{personalColorDetails.name}</strong>
        </div>

        <div className="container-center">
          <div className="summary">
            <strong>{personalColorDetails.description}</strong>
          </div>
          <div className="result-hashtag">
            {Array.isArray(personalColorDetails.hashtag)
              ? personalColorDetails.hashtag.join(" ")
              : " "}
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

<div class="container-down">
  <div class="sub-color-section">
    <div class="icon-text" onClick={togglePopup}>
      
      <span>🎨 나의 서브컬러는?</span>
    </div>
  </div>
  <div class="sub-color-cards">
    <div class="sub-color-card">
      <strong>{Results[1].personal_color}</strong>
    </div>
    <div class="sub-color-card">
      <strong>{Results[2].personal_color}</strong>
    </div>
  </div>

  {showPopup && (
          <div className="popup" id="popup-message">
            실물이 아닌 이미지 기반 진단이기에 개인마다 색상 인식에 차이가 있을 수 있습니다. 때문에 1순위 메인 컬러 외에도 2순위와 3순위의 서브 컬러를 함께 알려드립니다.<br /> 이를 통해 보다 정확하고 다양한 색상 조합을 활용할 수 있습니다. 😊
          </div>
        )}
        </div>



        {/* <div className="container-down">
          <div className="sub-color-section" onClick={toggleExpand}>
            <i className="fa fa-info-circle"></i>
            <span>나의 서브컬러는?</span>
          </div>
          {expanded && (
            <div className="sub-colors-container">
              <div className="sub-color-card">
                <strong>{Results[1].personal_color}</strong>
              </div>
              <div className="sub-color-card">
                <strong>{Results[2].personal_color}</strong>

              </div>
            </div>
          )}
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

        {/* <div className="container-down">
          <div className="sub-color-section" onClick={toggleExpand}>
            <i className="fa fa-info-circle"></i>
            <span>나의 서브컬러는?</span>
          </div>
          {expanded && (
            <div className="sub-colors-container">
              <div className="sub-color-card">
                <strong>{Results[1].personal_color}</strong>
              </div>
              <div className="sub-color-card">
                <strong>{Results[2].personal_color}</strong>

              </div>
            </div>
          )}
        </div> */}
      </div>

      {/* 이미지 컨테이너 (우측 정렬) */}
      <div className="character-container">
        <div className="personal-character-image">
          <img src={imageUrl} alt={personalColorDetails.name} />
        </div>
      </div>
    </SmallMain>
  );
};
export default Result;
