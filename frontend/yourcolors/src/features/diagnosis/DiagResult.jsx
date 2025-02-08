import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background from "../../background/background/Background";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import Result from "./Result";
import PersonalColorDetailContent from "../personal-colors/PersonalColorDetailContent";
import BestWorst from "./BestWorst";
import PersonalRecommend from "../recommend/PersonalRecommend";

import "./DiagResult.css"; 
import LeftRightButton from "../../button/left-right-button/LeftRightButton";

const DiagResult = () => {
  const [currentStep, setCurrentStep] = useState(0); // 현재 표시할 콘텐츠 상태

  // 🔹 콘텐츠 변경 로직
  const nextStep = () => {
    setCurrentStep((prevStep) => (prevStep + 1) % 4); // 0 → 1 → 2 → 3 → 0
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep - 1 + 4) % 4); // 3 → 2 → 1 → 0 → 3
  };

  // 🔹 콘텐츠 배열 (순서 유지)
  const steps = [
    { id: 0, component: <Result /> },  // 🔹 대표 퍼스널컬러
    { id: 1, component: <PersonalColorDetailContent /> },  // 🔹 세부 특징
    { id: 2, component: <BestWorst /> },  // 🔹 Best/Worst 컬러
    { id: 3, component: <PersonalRecommend /> },  // 🔹 추천 상품
  ];

  return (
    <Background>
      <Topbar />

      <div className="diag-result-container">
      {/* 🔹 애니메이션 적용된 콘텐츠 변경 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep} 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          // className="content-wrapper"
        >
          {steps[currentStep].component}
        </motion.div>
      </AnimatePresence>

      {/* 🔹 좌우 이동 버튼 */}
      <LeftRightButton onLeftClick={prevStep} onRightClick={nextStep} />
    </div>

      <Bottombar />
      </Background>
    
  );
};

export default DiagResult;
