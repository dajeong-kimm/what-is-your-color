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
import ColorConsulting from "./ColorConsulting.jsx";

const DiagResult = () => {
  const [currentStep, setCurrentStep] = useState(0); // 현재 표시할 콘텐츠 상태

  // 콘텐츠 변경 로직 (좌우 버튼)
  const nextStep = () => {
    setCurrentStep((prevStep) => (prevStep + 1 + 4) % 4);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep - 1 + 4) % 4);
  };

  // const personalId = 1; // 임시 ID (추후 변경)
  const { userPersonalId, fetchPersonalColorDetails } = useStore();

  useEffect(() => {
    fetchPersonalColorDetails(userPersonalId);
  }, [userPersonalId, fetchPersonalColorDetails]);

  // 콘텐츠 배열 (순서 유지)
  const steps = [
    { id: 0, component: <Result /> },
    // { id: 1, component: <PersonalColorDetailContent /> },
    { id: 1, component: <BestWorst /> },
    { id: 2, component: <PersonalRecommend /> },
    { id: 3, component: <ColorConsulting /> },
  ];

  return (
    <Background>
      <Topbar />
      <div className="diag-result-container">
        {/* AnimatePresence 및 motion.div를 사용한 Zoom 효과 (깜빡임 없이 부드럽게 확대/축소) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ scale: 0.95, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              zIndex: 0,
            }}
          >
            <ModalContainer>
              {steps[currentStep].component}
            </ModalContainer>
          </motion.div>
        </AnimatePresence>

        {/* 좌우 이동 버튼 */}
        <LeftRightButton 
          currentStep={currentStep} 
          onLeftClick={prevStep} 
          onRightClick={nextStep} 
        />

      </div>

      {/* Bottombar에 currentStep와 setCurrentStep을 prop으로 전달 */}
      <Bottombar currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </Background>
  );
};

export default DiagResult;