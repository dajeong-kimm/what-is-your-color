// DiagResult.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background from "../../background/background/Background";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar"; // Bottombar: currentStep prop 전달
import Result from "./Result";
import PersonalColorDetailContent from "../personal-colors/PersonalColorDetailContent";
import BestWorst from "./BestWorst";
import PersonalRecommend from "../recommend/PersonalRecommend";
import LeftRightButton from "../../button/left-right-button/LeftRightButton"; // 좌우 이동 버튼
import ModalContainer from "./ModalContainer";  // 새로 만든 모달 컨테이너
import "./DiagResult.css"; 
import useStore from '../../store/UseStore'; // Zustand 상태관리 데이터

const DiagResult = () => {
  const [currentStep, setCurrentStep] = useState(0); // 현재 표시할 콘텐츠 상태

  // 콘텐츠 변경 로직 (좌우 버튼)
  const nextStep = () => {
    setCurrentStep((prevStep) => (prevStep + 1) % 4);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep - 1 + 4) % 4);
  };

  const personalId = 1; // 임시 ID (추후 변경)
  const { fetchPersonalColorDetails } = useStore();

  useEffect(() => {
    fetchPersonalColorDetails(personalId);
  }, [personalId, fetchPersonalColorDetails]);

  // 콘텐츠 배열 (순서 유지)
  const steps = [
    { id: 0, component: <Result /> },
    { id: 1, component: <PersonalColorDetailContent /> },
    { id: 2, component: <BestWorst /> },
    { id: 3, component: <PersonalRecommend /> },
  ];

  return (
    <Background>
      <Topbar />
      <div className="diag-result-container">
        {/* 애니메이션 적용된 콘텐츠 전환 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ModalContainer로 감싸면 크기, 배경색, 정렬 등을 한 번에 관리 가능 */}
            <ModalContainer>
              {steps[currentStep].component}
            </ModalContainer>
          </motion.div>
        </AnimatePresence>

        {/* 좌우 이동 버튼 */}
        <LeftRightButton onLeftClick={prevStep} onRightClick={nextStep} />
      </div>

      {/* Bottombar에 currentStep와 setCurrentStep을 prop으로 전달 */}
      <Bottombar currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </Background>
  );
};

export default DiagResult;
