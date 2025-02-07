import React, { useEffect, useState } from 'react';
import Background from "../../background/background/BackGround";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import "./personalbutton.css";
import "./PersonalColorDetail.css";
import { useParams } from "react-router-dom";
// import personalColors from "../../data/PersonalColors";
// import dummyData from "../../data/dummy-data";

import useStore from '../../store/useStore'; //Zustand 상태관리 데이터터
import personalColorInfo from '../../store/personalColorInfo';  //정적 객체 데이터

const PersonalColorDetail = () => {
  const { id } = useParams();
  // const colorInfo = dummyData.find((color) => color.id === parseInt(id));
  const { personalColors, fetchPersonalColors } = useStore();
  const [loading, setLoading] = useState(true); // 🔹 로딩 상태 추가
  

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
  // console.log(colorInfo)

  // const { name, hashtags, description, imageUrl } = colorInfo;
//     const imageUrl = "../public/여름뮤트색상표.jpg"
//   const description = `장밋빛 피부를 가지고 있는 뮤트톤!
// 중간 밝기에서 어두운색의 스킨톤에 블랙이나 다크 브라운 계열의 눈동자 색을 가지고 있어 대비감은 약합니다.
// 그레이가 잘 어울리는 타입으로 스타일링도 메이크업도 전체적으로 은은하게 연출하면 좋아요!
// 말린 장미, 팥죽색 같은 채도가 낮은 부드러운 색을 선택하세요.`;

  return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="personal-detail-container-left">
          {/* 상단 타이틀 */}
          <h1 className="personal-detail-title">{personalColors[id-1].name}</h1>
          {/* 색상 이미지 */}
          <div className="personal-detail-image">
            <img src={personalColorInfo[id].imageUrl} alt={personalColors[id-1].name} />
          </div>
        </div>  

        <div className="personal-detail-container-right">
          {/* 해시태그 */}
          <div className="personal-detail-hashtags">
            {personalColors[id-1].hashtag.map((tag, index) => (
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
      <Bottombar />
    </Background>
  );
};

export default PersonalColorDetail;
