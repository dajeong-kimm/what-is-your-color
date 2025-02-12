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

  // 🛠 Markdown 스타일의 텍스트를 HTML로 변환하는 함수
  const parseGPTSummary = (text) => {
    if (!text) return "";
    return unified()
      .use(remarkParse) // Markdown 파싱
      .use(remarkRehype) // HTML 변환
      .use(rehypeStringify) // HTML 문자열로 변환
      .processSync(text)
      .toString();
  };

  return (
    <SmallMain>
      <div className="full-container">
        <div className="top-container">
          <h1 className="title">당신을 위한 컬러 컨설팅</h1>
        </div>

        {/* 🔹 GPT 컨설팅 내용 자동 변환 */}
        <div className="bottom-container">
          <div
            className="GPT-consulting"
            dangerouslySetInnerHTML={{ __html: parseGPTSummary(gptSummary) }}
          />
        </div>
      </div>
    </SmallMain>
  );
};

export default ColorConsulting;
