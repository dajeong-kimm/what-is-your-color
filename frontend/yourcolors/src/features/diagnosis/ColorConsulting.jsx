import React from "react";
import "./ColorConsulting.css"; // 기존 스타일 재사용
import useStore from "../../store/UseStore"; // Zustand 상태관리 데이터
import SmallMain from "../../background/background/SmallMain";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const ColorConsulting = () => {
  const { gptSummary } = useStore();

  // 🛠 GPT 응답에서 제목과 본문을 분리하고 불필요한 부분 제거하는 함수
  const parseGPTSummary = (text) => {
    if (!text) return { title: "", content: "" };

    let title = "";
    let filteredText = text;



    // 2️⃣ "사용자 정보"라는 글자가 등장하면, 그 부분부터 끝까지 제거
    const userInfoIndex = filteredText.indexOf("사용자 정보");
    if (userInfoIndex !== -1) {
      filteredText = filteredText.substring(0, userInfoIndex);
    }

    // 3️⃣ "🌸" 문양이 등장하면, 첫 번째 🌸부터 다음 🌸까지(양쪽의 꽃 포함) 제거
    filteredText = filteredText.replace(/🌸[^🌸]*🌸/g, "");

    // 4️⃣ 불필요한 줄바꿈/여백 조정을 위한 replace (필요 시 수정)
    filteredText = filteredText.replace(/([^.?!])\s(?=[A-Z가-힣])/g, "$1 <br>");

    // 5️⃣ Markdown -> HTML 변환
    const processedText = unified()
      .use(remarkParse)      // Markdown 파싱
      .use(remarkRehype)     // HTML 변환
      .use(rehypeStringify)  // HTML 문자열로 변환
      .processSync(filteredText)
      .toString();

    return { title, content: processedText };
  };

  const { title, content } = parseGPTSummary(gptSummary);

  return (
    <SmallMain>
      <div className="consulting-container">
        <div className="top-container">
          {/* 🔹 제목을 별도 태그로 표시 (CSS에서 가운데 정렬) */}
          <h2 className="consulting-title">🌸 퍼스널 컬러 컨설팅 결과 🌸</h2>
        </div>
        <div className="bottom-container">
          <div className="GPT-consulting">
            {/* 🔹 본문 내용: GPT가 제공하는 띄어쓰기 및 줄바꿈 유지 */}
            <div
              style={{
                textAlign: "left",
                whiteSpace: "pre-wrap",  // 원본 띄어쓰기를 최대한 유지
                lineHeight: "1.1"         // 줄 간격 다소 줄임
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </SmallMain>
  );
};

export default ColorConsulting;
