import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BackgroundPage from "./common/components/BackgroudPage"; // 방금 생성한 파일 경로

function App() {
  
  return (
    <Router>
      <Routes>
        
        {/* 다른 페이지를 위한 라우트 */}
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/test" element={<BackgroundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
