import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // URL에서 퍼스널컬러 가져오기
import ProductButton from "../../button/product-button/ProductButton";
import SmallMain from '../../background/background/SmallMain';
import LeftRightButton from "../../button/left-right-button/LeftRightButton"; // 🔹 추가
import "./PersonalColorRecommend.css";

import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터

// 더미 데이터 (카테고리별 화장품 목록)
// const dummyData = {
//   립: [
//     { id: 1, name: "레드 립스틱", image: "/images/lip1.jpg" },
//     { id: 2, name: "핑크 틴트", image: "/images/lip2.jpg" },
//     { id: 3, name: "코랄 립밤", image: "/images/lip3.jpg" },
//     { id: 4, name: "버건디 립스틱", image: "/images/lip4.jpg" },
//     { id: 5, name: "누드 립스틱", image: "/images/lip5.jpg" },
//   ],
//   아이섀도우: [
//     { id: 1, name: "브라운 섀도우", image: "/images/shadow1.jpg" },
//     { id: 2, name: "골드 섀도우", image: "/images/shadow2.jpg" },
//   ],
//   치크: [
//     { id: 1, name: "핑크 블러셔", image: "/images/blush1.jpg" },
//     { id: 2, name: "피치 블러셔", image: "/images/blush2.jpg" },
//   ],
// };

const PersonalRecommend = () => {
  // const { personalColor } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("lip"); // 기본값 립
  const { cosmetics, fetchCosmetics, loading, userPersonalId, personalColorDetails } = useStore();

  useEffect(() => {
    if (userPersonalId) {
      fetchCosmetics(userPersonalId);
    }
  }, [userPersonalId, fetchCosmetics]);

  // 선택한 카테고리에 맞는 제품 리스트 가져오기
  console.log(cosmetics)
  
  const categoryMap = {
    lip: cosmetics.lip,
    eye: cosmetics.eye,
    cheek: cosmetics.cheek,
  };
  const products = categoryMap[selectedCategory] || [];
  
  const navigate = useNavigate(); // 🔹 네비게이션 훅 추가
  
  const handleRightClick = () => {
    console.log("오른쪽으로 이동 불가 ㅡㅡ");
  };
  
  const handleLeftClick = () => {
    navigate("/bestworst");
  };
  

  return (
    <SmallMain>

        <div className="full-container">
          <div className="top">
            {/* 퍼스널컬러 이름 + "Pick!" 형태로 출력 */}
            <div className="color-pick">{personalColorDetails.name} Pick!</div>
            <div className="button-container">
             {["lip", "eye", "cheek"].map((category) => (
                <ProductButton
                  key={category}
                  text={category}
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
          </div>
          <div className="product-container">
            {loading ? (
              <p className="loading-text">로딩 중...</p>
            ) :products.length > 0 ? (
              <div className="product-grid">
                {products.map((product) => (
                  <div key={product.product_id} className="product-card">
                    <img src={product.image} alt={product.product_name} />
                    <p>{product.brand}</p>
                    <p>{product.product_name}</p>
                    <p>{product.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-products">상품이 없습니다.</p>
            )}
          </div>
        </div>
      
</SmallMain>


  );
};

export default PersonalRecommend;
