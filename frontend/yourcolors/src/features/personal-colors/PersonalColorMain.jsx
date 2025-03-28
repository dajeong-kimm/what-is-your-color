import React from 'react';
import { useRecoilValue } from "recoil";
import { PersonalColorState } from "../../recoil/PersonalColorsAtom";
import PersonalButton from "./PersonalButton";
import Background from "../../background/background/Background";
import LargeMain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import "./PersonalButton.css"; // ✅ 버튼 스타일 적용
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터
import personalColorInfo from '../../store/PersonalColorInfo';

const PersonalColorMain = () => {
  const colors = useRecoilValue(PersonalColorState); 


  // 퍼스널컬러 그룹 (제공된 배열 구조로 나누기)
  const groupedColors = [
    colors.slice(0, 3), // 봄: 라이트, 비비드, 브라이트
    colors.slice(3, 6), // 여름: 라이트, 브라이트, 뮤트
    colors.slice(6, 9), // 가을: 뮤트, 스트롱, 다크
    colors.slice(9, 12), // 겨울: 비비드, 스트롱, 다크
  ]
  

  const colorTitles = ["Spring", "Summer", "Autumn", "Winter"];

  return (
    <Background>
      <Topbar />
      <LargeMain>
        <div className="personal-color-container">
          {/* 그룹별로 제목과 버튼을 렌더링 */}
          {groupedColors.length > 0 &&
            groupedColors.map((group, index) => (
              <div key={index} className="personal-color-group">
                {/* 각 그룹에 제목 추가 */}
                <p className="color-group-title">{colorTitles[index]}</p>
                {group.map((color) => (
                  <PersonalButton
                    key={color.id}
                    id={color.id}
                    label={color.name}
                    colorClass={color.colorClass}
                  />
                ))}
              </div>
            ))}
        </div>
      </LargeMain>
    </Background>
  );
};

export default PersonalColorMain;
