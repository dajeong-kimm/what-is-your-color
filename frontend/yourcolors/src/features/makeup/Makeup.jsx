import React, { useState } from "react";
import Background from "../../background/background/Background";
import LargeMain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import MakeupCamera from './MakeupCamera';
import ProductButton from '../../button/product-button/ProductButton';
import "./Makeup.css";
import useStore from '../../store/UseStore'; //Zustand 상태관리 데이터
import RightButton from "../../button/left-right-button/RightButton";

const Makeup = () => {
  const { cosmetics, loading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("lip");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 선택한 카테고리의 화장품 리스트 가져오기
  const categoryMap = {
    lip: cosmetics.lip,
    eye: cosmetics.eye,
    cheek: cosmetics.cheek,
  };
  const products = categoryMap[selectedCategory] || [];

  return (
    <div className="camera-container">
      <Background>
        <Topbar />

        <LargeMain>
        <div className="largemain">
            {/* 왼쪽 패널 - 카테고리 선택 버튼 */}
            <div className="left-panel">
              
              <div className="button-container">
                {["lip", "eye", "cheek"].map((category) => (
                  <ProductButton
                    key={category}
                    text={category}
                    onClick={() => setSelectedCategory(category)}
                  />
                ))}
              </div>

              {/* 선택한 카테고리의 화장품 리스트 */}
              <div className="product-list">
                {loading ? (
                  <p>로딩 중...</p>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <div 
                    key={product.product_id}
                    className={`product-card ${selectedProduct === product ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedProduct(product)
                        console.log("클릭@!!!");
                      }
                    }
                  >
                    <img src={product.image} alt={product.product_name} />
                    <p>{product.product_name}</p>
                  </div>

                  ))
                ) : (
                  <p>상품이 없습니다.</p>
                )}
              </div>
            </div>

            {/* 오른쪽 패널 - 카메라 */}
            <div className="right-panel">
              <MakeupCamera />
            </div>
          </div>
        </LargeMain>
          <RightButton/>
      </Background>
    </div>
  );
};

export default Makeup;