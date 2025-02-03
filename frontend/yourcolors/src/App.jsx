import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./features/start/Home";
import MainPage from "./features/start/Mainpage";
import Mainpage2 from "./features/start/Mainpage2";
import Diagpage1 from "./features/diagnosis/Diagpage1";
import TestPage from "./common/components/TestPage";
import PersonalColorMain from './features/personalcolors/PersonalColorMain';
// import PersonalDetail from './features/personalcolors/PersonalDetail';
import { RecoilRoot } from 'recoil';

const App = () => {
  return (
    <RecoilRoot>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/mainpage2" element={<Mainpage2 />} />
        <Route path="/diagpage1" element={<Diagpage1 />} />

        <Route path="/test" element={<TestPage />} />
        <Route path="/personalcolors" element={<PersonalColorMain />} />
        {/* <Route path="/:id" element={<PersonalDetail />} /> */}
        {/* <Route path="/recommend" element={<Recommend />} />
        <Route path="/makeup" element={<Makeup />} />
        
        <Route path="/diagnosis" element={<Diagnosis />} /> */}
      </Routes>
    </Router>
    </RecoilRoot>
    
  );
};

export default App;

