import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./TopBar.css";
import Topbutton from "./TopButton";
import Logo from "../../assets/yourcolor.png"; // 로고 이미지 import

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  // 현재 경로에 따라 activeButton 값을 결정
  let activeButton = null;
  if (location.pathname.startsWith("/personalcolors")) {
    activeButton = "personalcolor";
  } else if (
    location.pathname === "/choice" ||
    location.pathname === "/diagcapturexai" ||
    location.pathname === "/diagcapturex" ||
    location.pathname === "/diagcapture" ||
    location.pathname === "/diagresult"
  ) {
    activeButton = "diagnosis";
  } else if (location.pathname === "/makeup") {
    activeButton = "makeup";
  } else if (location.pathname === "/qna") {
    activeButton = "qna"; // QnA 페이지 active 처리
  } else if (location.pathname === "/") {
    activeButton = "start";
  }

  // 버튼 정보 배열 (처음으로 버튼 추가)
  const buttons = [
    { to: "/personaldefine", label: "퍼스널컬러란?", name: "define" },
    { to: "/personalcolors", label: "퍼스널컬러 종류", name: "personalcolor" },
    { to: "/qna", label: "QnA", name: "qna" }, // QnA 버튼 추가
    { to: "/mainpage", label: "메인페이지", name: "main" },
    { to: "#", label: "처음으로", name: "start", onClick: () => setIsModalOpen(true) }, // 모달 트리거 버튼
  ];

  // "예" 버튼 클릭 시 홈 이동
  const handleYes = () => {
    navigate("/");
  };

  // "아니오" 버튼 클릭 시 모달 닫기
  const handleNo = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="Topbar">
      <div className="Topbar-container">
        <Link to="/">
          <img src={Logo} alt="로고" className="logo-img" />
        </Link>
        <div className="Topbar-buttons">
          {buttons.map((button) =>
            button.name === "start" ? (
              // "처음으로" 버튼은 별도로 클릭 이벤트 처리
              <button
                key={button.name}
                className={`top-button ${activeButton === button.name ? "active" : ""}`}
                onClick={button.onClick}
              >
                {button.label}
              </button>
            ) : (
              <Topbutton
                key={button.name}
                to={button.to}
                label={button.label}
                isActive={activeButton === button.name}
              />
            )
          )}
        </div>
      </div>

      {/* 모달 (isModalOpen이 true일 때만 렌더링) */}
      {isModalOpen && (
        <div className="close-modal-overlay">
          <div className="close-modal-content">
            <h2>
              “너의 색깔은 ?” <br />
              체험을 종료하시겠습니까?
            </h2>
            <div className="close-modal-buttons">
              <button className="close-modal-yes" onClick={handleYes}>
                예
              </button>
              <button className="close-modal-no" onClick={handleNo}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
