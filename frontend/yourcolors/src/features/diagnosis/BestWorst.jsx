import React, { useEffect } from 'react';
import "./BestWorst.css"; // 스타일 import
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터
import { useNavigate } from "react-router-dom";
import SmallMain from '../../background/background/SmallMain';
import LeftRightButton from "../../button/left-right-button/LeftRightButton"; // 🔹 추가
import BestWorstCamera from "../camera/BestWorstCamera";
import BestWorstCamera2 from "../camera/BestWorstCamera2";


const BestWorst = () => {
  const navigate = useNavigate(); // 🔹 네비게이션 훅 추가

    // Zustand 상태에서 personalColorDetails 가져오기
    const { personalColorDetails, gptSummary } = useStore();
  

  const handleLeftClick = () => {
    navigate("/personalcolors/12");
  };
  
  const handleRightClick = () => {
    navigate("/recommend");
  };


   return (
     <SmallMain>
   {/* <BestWorstCamera/> */}
        <div className="full-container">
        {/* <BestWorstCamera2/> */}
          <div className="top-container">
        
            {/* Best Color Section */}
           <div className="container-best">
            
             <h1 className="title">Best Color</h1>
              <div className="color-boxes">
                {/* Best Color 목록에서 색상값을 렌더링 */}
                {personalColorDetails.bestcolor.map((color, index) => (
                    <div key={index} className="color-box" 
                    style={{ backgroundColor: color }}></div> ))}
              </div> {/* 이거 5가지 컬러 박스니까 안에 데이터만 변경!!!!!!!!!!!!*/}
              <BestWorstCamera/>
                {/* <ul>
                  {personalColorDetails.bestcolor_name?.map((color, index) => (
                    <li key={index}>{color}</li>
                  ))}
                </ul> */}
             {/* 베스트 컬러 색을 입힌 카메라 넣기 */}
            
            </div>
            

              {/* Worst Color Section */}
            <div className="container-worst">
              <h1 className="title">Worst Color</h1>
              <div className="color-boxes">
                {personalColorDetails.worstcolor.map((color, index) => (
                    <div key={index} className="color-box" 
                    style={{ backgroundColor: color }}></div> ))}
              </div>
              <BestWorstCamera/>
                {/* <ul>
                  {personalColorDetails.worstcolor_name?.map((color, index) => (
                    <li key={index}>{color}</li>
                  ))}
                </ul> */}
                  {/* 워스트 컬러 색을 입힌 카메라 넣기 */}

            </div>
         </div>
        
          {/* <div className="bottom-container">
            <div className="GPT-consulting">{gptSummary}</div>
          </div> */}
        </div>
      
</SmallMain>

  );
};

export default BestWorst;