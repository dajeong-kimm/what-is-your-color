import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // URL에서 퍼스널컬러 가져오기
import ProductButton from "../../button/product-button/ProductButton";
import SmallMain from "../../background/background/SmallMain";
import "./PersonalColorRecommend.css";

import useStore from "../../store/UseStore"; //Zustand 상태관리 데이터

const PersonalRecommend = () => {
  // const { personalColor } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("lip"); // 기본값 립
  const { cosmetics, fetchCosmetics, fetchMenCosmetics, loading, userPersonalId, personalColorDetails } = useStore();

  useEffect(() => {
    if (userPersonalId) {
      // 순차적으로 API 호출
      const fetchData = async () => {
        await fetchCosmetics(userPersonalId);
        await fetchMenCosmetics(userPersonalId);
      };
      fetchData();
    }
  }, [userPersonalId, fetchCosmetics, fetchMenCosmetics]);

  const categoryMap = {
    lip: cosmetics.lip,
    eye: cosmetics.eye,
    cheek: cosmetics.cheek,
    men: cosmetics.men,
  };
  const products = categoryMap[selectedCategory] || [];

  return (
    <SmallMain>
      <div className="recommend-container">
        <div className="recommend-top">
          {/* 퍼스널컬러 이름 + "Pick!" 형태로 출력 */}
          <div className="recommend-color-pick">{personalColorDetails.name} Pick!</div>
          <div className="recommend-button-container">
            {["lip", "eye", "cheek", "men"].map((category) => {
              const isActive = selectedCategory === category;
              const defaultColor = category === "men" ? "#9fd3fe" : "#feb7ae";
              const activeColor = category === "men" ? "#57b3fe" : "#fe7575";

              return (
                <ProductButton
                  key={category}
                  text={category}
                  onClick={() => setSelectedCategory(category)}
                  active={isActive}
                  style={{
                    backgroundColor: isActive ? activeColor : defaultColor,
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="recommend-product-container">
          {loading ? (
            <p className="loading-text">로딩 중...</p>
          ) : products.length > 0 ? (
            <div className="recommend-product-grid">
              {products.map((product) => (
                <div key={product.product_id} className="recommend-product-card">
                  <img src={product.image} alt={product.product_name} />
                  <p className="brand-name">{product.brand}</p>
                  <p className="product-name">{product.product_name}</p>
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
