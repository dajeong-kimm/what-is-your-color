import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // URL에서 퍼스널컬러 가져오기
import useStore from "../../store/UseStore"; //Zustand 상태관리 데이터터
import Background from "../../background/background/Background";
import Topbar from "../../button/top/TopBar";
import BottomBarPersonal from "../../button/bottom/BottomBarPersonal";
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
      setLoading(true); // 로딩 시작
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
  if (!personalColors[id - 1]) {
    return <h2>해당 퍼스널컬러 정보를 찾을 수 없습니다.</h2>;
  }

  return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="detail-container-left">
          {/* 상단 타이틀 */}
          <h1 className={`detail-title`}>
          {personalColorInfo[id].name}
          </h1>
          <div className="detail-description">
            {personalColorInfo[id].description}
          </div>


        </div>

        <div className="detail-container-right">
          {/* 추천 컬러 팔레트 */}
          <div className="detail-section">
            <h1 className="section-title">🎨 추천 컬러 팔레트</h1>
            <div className="color-palette">
              <div className="color-group">
                <h3>Best</h3>
                <div className="color-list">
                  {personalColorInfo[id].bestColors.map(
                    (color, index) => (
                      <div
                        key={index}
                        className="color-box"
                        style={{ backgroundColor: color }}
                      ></div>
                    )
                  )}
                </div>
              </div>
              <div className="color-group">
                <h3>Sub</h3>
                <div className="color-list">
                  {personalColorInfo[id].subColors.map(
                    (color, index) => (
                      <div
                        key={index}
                        className="color-box"
                        style={{ backgroundColor: color }}
                      ></div>
                    )
                  )}
                </div>
              </div>
              <div className="color-group">
                <h3>Worst</h3>
                <div className="color-list">
                  {personalColorInfo[id].worstColors.map(
                    (color, index) => (
                      <div
                        key={index}
                        className="color-box"
                        style={{ backgroundColor: color, opacity: 0.5 }}
                      ></div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SmallMain>

      <BottomBarPersonal />
    </Background>
  );
};

export default PersonalColorDetail;
