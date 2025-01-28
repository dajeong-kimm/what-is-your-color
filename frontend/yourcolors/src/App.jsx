import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Background from "./common/components/Background";
import Topbar from './common/components/Topbar';


const App = () => {
  return (
    <Router>
      <Background />
      <Topbar />
      <Routes>
        {/* 각 페이지 컴포넌트 정의 */}
        <Route path="/personalcolor" element={<div>퍼스널컬러란?</div>} />
        <Route path="/diagnosis" element={<div>퍼스널컬러 진단</div>} />
        <Route path="/makeup" element={<div>AI 메이크업 합성</div>} />
      </Routes>
    </Router>
  );
};

export default App;