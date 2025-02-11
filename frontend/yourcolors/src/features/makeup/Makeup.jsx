import React, { useState, useEffect } from "react";
import Background from "../../background/background/Background";
import LargeMain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import MakeupCamera from "./MakeupCamera";
import ProductButton from "../../button/product-button/ProductButton";
import "./Makeup.css";
import useStore from "../../store/UseStore"; //Zustand 상태관리 데이터

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

const personalColors = [
  { id: 1, name: "봄 웜 라이트" },
  { id: 2, name: "봄 웜 비비드" },
  { id: 3, name: "봄 웜 브라이트" },
  { id: 4, name: "여름 쿨 라이트" },
  { id: 5, name: "여름 쿨 브라이트" },
  { id: 6, name: "여름 쿨 뮤트" },
  { id: 7, name: "가을 웜 뮤트" },
  { id: 8, name: "가을 웜 스트롱" },
  { id: 9, name: "가을 웜 다크" },
  { id: 10, name: "겨울 쿨 비비드" },
  { id: 11, name: "겨울 쿨 스트롱" },
  { id: 12, name: "겨울 쿨 다크" }
];


const Makeup = () => {
  const { cosmetics, loading, fetchCosmetics, fetchProductDetails, productDetails } = useStore();
  const [selectedPersonalColor, setSelectedPersonalColor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("lip");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  // 선택한 카테고리의 화장품 리스트 가져오기
  const categoryMap = {
    lip: cosmetics.lip,
    eye: cosmetics.eye,
    cheek: cosmetics.cheek,
  };

  const products = categoryMap[selectedCategory] || [];

  useEffect(() => {
    if (selectedPersonalColor) fetchCosmetics(selectedPersonalColor);
  }, [selectedPersonalColor]);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductDetails(selectedProduct.product_id);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (productDetails?.colors?.length > 1) {
      setIsModalOpen(true);
    } else if (productDetails?.colors?.length === 1) {
      setSelectedColor(productDetails.colors[0]);
    }
  }, [productDetails]);

//   // selectedColor가 업데이트 될 때마다 MakeupCamera에 색상을 전달
// useEffect(() => {
//   if (selectedColor) {
//     // MakeupCamera에 선택된 색상 전달
//     setSelectedProduct((prevProduct) => ({
//       ...prevProduct,
//       color: selectedColor.hex, // selectedColor의 hex 값
//     }));
//   }
// }, [selectedColor]);


  return (
    <div className="camera-container">
      <Background>
        <Topbar />
        <LargeMain>
        <div className="personal-color-buttons">
                  {personalColors.map((color) => (
                    <button
                      key={color.id}
                      className={`personal-color-button ${
                        selectedPersonalColor === color.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedPersonalColor(color.id)} // personalId로 색상 선택
                    >
                      {color.name}
                    </button>
                  ))}
                </div>

                {/* bottom-panel: left-panel과 right-panel이 좌우 배치됨 */}
                <div className="bottom-panel">
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
                      className={`product-card ${
                        selectedProduct === product ? "selected" : ""
                      }`}
                      onClick={() => setSelectedProduct(product)}
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
              {/* <MakeupCamera selectedColor={selectedColor} /> */}
              {/* <MakeupCamera /> */}
              <MakeupCamera
  lipColor={selectedCategory === "lip" ? selectedColor?.hex : null}
  eyeShadowColor={selectedCategory === "eye" ? selectedColor?.hex : null}
  blushColor={selectedCategory === "cheek" ? selectedColor.hex : null}
/>
            </div>
          </div>
        </LargeMain>
        {isModalOpen && productDetails?.colors?.length > 0 && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3>색상을 선택하세요</h3>
          <div className="color-options">
            {productDetails.colors.map((color, index) => (
              <div
                key={index}
                className="color-circle"
                style={{ backgroundColor: color.hex }}
                onClick={() => {
                  setSelectedColor(color);
                  setIsModalOpen(false);
                }}
              ></div>
            ))}
          </div>
        </Modal>
      )}
      </Background>
      </div>
  );
};

export default Makeup;
