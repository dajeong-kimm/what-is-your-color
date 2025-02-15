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
        {/* <div className="full-container"> */}
          <div className="bs-container">
            {/* Best Color Section */}
           <div className="container-best">
               {/* <BestWorstCamera2/> */}
             <h1 className="title"><i class="fa-regular fa-face-kiss-wink-heart"></i> Best Color <i class="fa-regular fa-face-kiss-wink-heart"></i></h1>
              <div className="color-boxes">
                {/* Best Color 목록에서 색상값을 렌더링 */}
                {personalColorDetails.bestcolor.map((color, index) => (
                    <div key={index} className="color-box" 
                    style={{ backgroundColor: color }}></div> ))}
              </div> {/* 이거 5가지 컬러 박스니까 안에 데이터만 변경!!!!!!!!!!!!*/}
              <BestWorstCamera2 colorData={personalColorDetails.bestcolor} />
                {/* <ul>
                  {personalColorDetails.bestcolor?.map((color, index) => (
                    <li key={index}>{color}</li>
                  ))}
                </ul> */}
                {/* <ul>
                  {personalColorDetails.bestcolor_name?.map((color, index) => (
                    <li key={index}>{color}</li>
                  ))}
                </ul> */}
             {/* 베스트 컬러 색을 입힌 카메라 넣기 */}
            
            </div>
            

              {/* Worst Color Section */}
            <div className="container-worst">
            
              <h1 className="title"><i class="fa-regular fa-face-sad-tear"></i> Worst Color <i class="fa-regular fa-face-sad-tear"></i></h1>
              <div className="color-boxes">
                {personalColorDetails.worstcolor.map((color, index) => (
                    <div key={index} className="color-box" 
                    style={{ backgroundColor: color }}></div> ))}
              </div>
              <BestWorstCamera2 colorData={personalColorDetails.worstcolor} />

            </div>
         </div>
        
      
</SmallMain>

  );
};

export default BestWorst;