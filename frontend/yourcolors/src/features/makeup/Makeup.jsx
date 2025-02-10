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

const Makeup = () => {
  const { cosmetics, loading, fetchProductDetails, productDetails } =
    useStore();

  const [selectedCategory, setSelectedCategory] = useState("lip");
  const [selectedProduct, setSelectedProduct] = useState(null);
  // 모달 상태
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
              <MakeupCamera selectedColor={selectedColor} />
            </div>
          </div>
        </LargeMain>
      </Background>
      {/* 모달 */}
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
    </div>
  );
};

export default Makeup;