import React, { useState } from "react";
import ProductButton from "./ProductButton";

const ProductButtonGroup = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    console.log("버튼 클릭:", index, "현재 activeIndex:", activeIndex);
    // 이미 활성화된 버튼을 클릭하면 비활성화, 그렇지 않으면 해당 버튼 활성화
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div>
      {["버튼 1", "버튼 2", "버튼 3"].map((text, index) => (
        <ProductButton
          key={index}
          text={text}
          isActive={activeIndex === index}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default ProductButtonGroup;
