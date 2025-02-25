// src/button/card-button/CardButton.jsx
import React from "react";
import "./CardButton.css";

/**
 * @param {string} title       상단에 보여줄 제목
 * @param {string} icon        카드 중앙에 보여줄 이모지/아이콘
 * @param {string} description 카드 본문 텍스트
 * @param {function} onClick   카드 클릭 시 동작
 * @param {string} bgImage     상단 배경이미지 URL 또는 import
 */
const CardButton = ({ title, icon, description, onClick, bgImage }) => {
  return (
    <div className="card-button" onClick={onClick}>
      {/* 상단 영역 (배경 이미지) */}
      <div
        className="card-button__header"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <h3>{title}</h3>
      </div>

      {/* 가운데 영역 (아이콘, 설명) */}
      <div className="card-button__body">
        <div className="card-button__icon">{icon}</div>
        <p className="card-button__description">{description}</p>
      </div>

      {/* 하단 버튼(Discover) - 원하는 텍스트로 변경 가능 */}
      {/* <div className="card-button__footer">
        <button className="card-button__footer-btn">Discover</button>
      </div> */}
    </div>
  );
};

export default CardButton;
