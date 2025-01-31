
import React from "react";
import ProductButton from "../../button/productbutton/ProductButton";
const TestPage = () => {
  return (
      <div style={styles.componentWrapper}>
        {/* 공통 버튼 컴포넌트 */}
        <ProductButton text="립" onClick={() => alert("Button clicked!")} />
        <ProductButton text="아이섀도우" onClick={() => alert("Button clicked!")} />
        <ProductButton text="치크" onClick={() => alert("Button clicked!")} />

      </div>
    
  );
};

const styles = {
  container: {
    backgroundColor: "#f0f4f8", // 배경색
    height: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  componentWrapper: {
    display: "flex",
    gap: "20px", // 컴포넌트 간 간격
    flexWrap: "wrap", // 컴포넌트가 넘치면 다음 줄로 감
    alignItems: "center",
    justifyContent: "center",
  },
};

export default TestPage;
