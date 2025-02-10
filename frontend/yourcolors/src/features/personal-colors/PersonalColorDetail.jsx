import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"; // URL에서 퍼스널컬러 가져오기
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터터
import Background from "../../background/background/Background";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import BottomBarPersonal from "../../button/bottom/BottomBarPersonal"
import PersonalColorDetailContent from "./PersonalColorDetailContent";
import LeftRightButton from "../../button/left-right-button/LeftRightButton"; // 🔹 추가

import "./PersonalButton.css";
import "./PersonalColorDetail.css";


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

  return (
    <Background>
      <Topbar />
      <PersonalColorDetailContent />
    <BottomBarPersonal />
    </Background>
  );
};

export default PersonalColorDetail;
