import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // URL에서 퍼스널컬러 가져오기
import Background from "../../background/background/Background";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import ProductButton from "../../button/product-button/ProductButton";
import LeftRightButton from "../../button/left-right-button/LeftRightButton"; // 🔹 추가
import "./PersonalColorRecommend.css";

// 더미 데이터 (카테고리별 화장품 목록)
const dummyData = {
  립: [
    { id: 1, name: "레드 립스틱", image: "/images/lip1.jpg" },
    { id: 2, name: "핑크 틴트", image: "/images/lip2.jpg" },
    { id: 3, name: "코랄 립밤", image: "/images/lip3.jpg" },
    { id: 4, name: "버건디 립스틱", image: "/images/lip4.jpg" },
    { id: 5, name: "누드 립스틱", image: "/images/lip5.jpg" },
  ],
  아이섀도우: [
    { id: 1, name: "브라운 섀도우", image: "/images/shadow1.jpg" },
    { id: 2, name: "골드 섀도우", image: "/images/shadow2.jpg" },
  ],
  치크: [
    { id: 1, name: "핑크 블러셔", image: "/images/blush1.jpg" },
    { id: 2, name: "피치 블러셔", image: "/images/blush2.jpg" },
  ],
};

const PersonalRecommend = () => {
  const { personalColor } = useParams(); // URL에서 퍼스널컬러 가져오기
  const [selectedCategory, setSelectedCategory] = useState("립"); // 기본값 립
  const products = dummyData[selectedCategory] || []; // 선택한 카테고리의 화장품 리스트

  const navigate = useNavigate(); // 🔹 네비게이션 훅 추가
  
  const handleRightClick = () => {
    console.log("오른쪽으로 이동 불가 ㅡㅡ");
  };
  
  const handleLeftClick = () => {
    navigate("/bestworst");
  };
  

  return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="full-container">
          <div className="top">
            {/* 퍼스널컬러 이름 + "Pick!" 형태로 출력 */}
            <div className="color-pick">{personalColor} Pick!</div>
            <div className="button-container">
              {["립", "아이섀도우", "치크"].map((category) => (
                <ProductButton
                  key={category}
                  text={category}
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
          </div>
          <div className="product-container">
            {products.length > 0 ? (
              <div className="product-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <p>{product.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-products">상품이 없습니다.</p>
            )}
          </div>
        </div>
      </SmallMain>
      {/* 🔹 화살표 네비게이션 버튼 추가 */}
      <LeftRightButton 
        onLeftClick={handleLeftClick} // 왼쪽 버튼 동작 추가 가능
 
      />
      <Bottombar />
    </Background>
  );
};

export default PersonalRecommend;
