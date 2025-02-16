/* Qna.jsx */
import React, { useState } from "react";
import Background from "../../background/background/Background";
import Topbar from "../../button/top/TopBar";
import Largemain from "../../background/background/LargeMain";
import "./Qna.css";

const QnA = () => {
  const qnaList = [
    {
      question: "Q. 조명이나 각도에 따라 다른 퍼스널 컬러 결과가 나올 수 있지 않나요?",
      answer: `- **AI 진단:** 다양한 조명 환경(자연광, 형광등, 주광색 등)에서 학습된 AI 모델을 사용해요.\n  현재 진단받는 환경의 조명 상태까지 분석하여 약 **79%의 정확도**로 신뢰성 있는 결과를 제공합니다.\n- **색상 거리 진단:** 화이트밸런싱 기술을 적용해 주변 조명에 영향을 받지 않고 실제 피부 톤에 가장 가까운 색상 데이터를 기반으로 진단해요.`
    },
    {
      question: "Q. 연속으로 두 번 진단했는데, 다른 결과가 나왔어요.",
      answer: `- **퍼스널 컬러는 절대적인 하나의 컬러가 아닌, 개인의 다양한 색조 특성을 포함한 스펙트럼이에요.**\n- 두 번의 결과가 같은 톤 그룹 내에서 유사한 컬러 타입이라면, 이는 사용자의 퍼스널 컬러가 **경계선에 위치한 ‘복합 타입’**일 수 있다는 뜻이에요.\n- 보다 정확한 결과를 위해 **평균 2~3회 진단**을 바탕으로 공통된 톤을 참고하는 것이 좋아요.`
    },
    {
      question: "Q. 메인 컬러는 '가을 웜 다크'인데, 서브컬러로 '여름 쿨 뮤트'와 '겨울 쿨 비비드'가 나올 수 있나요?",
      answer: `- **퍼스널 컬러는 메인 컬러와 함께 다양한 서브 톤 특성을 가질 수 있어요.**\n- ‘가을 웜 다크’와 ‘여름 쿨 뮤트’, ‘겨울 쿨 비비드’는 일부 컬러의 채도·명도에 따라 조화롭게 어울릴 수 있는 **‘톤온톤’** 또는 **‘톤인톤’** 컬러 조합이에요.`
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Markdown-like formatting (bold: **text**)
  const renderFormattedText = (text) => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts = text.split(regex);

    return parts.map((part, idx) =>
      idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
    );
  };

  return (
    <Background>
      <Topbar />
      <Largemain>
        <div className="qna-container">
          {qnaList.map((item, index) => (
            <div key={index} className={`qna-item ${activeIndex === index ? "active" : ""}`}>
              <div className="qna-question" onClick={() => toggleAnswer(index)}>
                {item.question}
              </div>
              {activeIndex === index && (
                <div className="qna-answer">
                  {item.answer.split('\n').map((line, idx) => (
                    <p key={idx}>{renderFormattedText(line)}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Largemain>
    </Background>
  );
};

export default QnA;
