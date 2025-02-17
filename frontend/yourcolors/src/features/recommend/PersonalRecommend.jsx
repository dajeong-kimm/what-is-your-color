import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // URL에서 퍼스널컬러 가져오기
import ProductButton from "../../button/product-button/ProductButton";
import SmallMain from '../../background/background/SmallMain';
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


  return (
    <SmallMain>

        <div className="recommend-container">
          <div className="recommend-top">
            {/* 퍼스널컬러 이름 + "Pick!" 형태로 출력 */}
            <div className="recommend-color-pick">{personalColorDetails.name} Pick!</div>
            <div className="recommend-button-container">
             {["lip", "eye", "cheek"].map((category) => (
                <ProductButton
                  key={category}
                  text={category}
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
          </div>
          <div className="recommend-product-container">
            {loading ? (
              <p className="loading-text">로딩 중...</p>
            ) :products.length > 0 ? (
              <div className="recommend-product-grid">
                {products.map((product) => (
                  <div key={product.product_id} className="recommend-product-card">
                    <img src={product.image} alt={product.product_name} />
                    <p className="brand-name">{product.brand}</p>
                    <p className="product-name" >{product.product_name}</p>
                    <p className="color-name">{product.color_name}</p>
                    <p className="price">{product.price}원</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="recommend-no-products">상품이 없습니다.</p>
            )}
          </div>
        </div>
      
</SmallMain>


  );
};

export default PersonalRecommend;
