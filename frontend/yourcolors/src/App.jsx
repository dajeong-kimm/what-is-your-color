import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./features/start/Home";
import MainPage from "./features/start/Mainpage";
import Mainpage2 from "./features/start/Mainpage2";
import Mainpage3 from "./features/start/Mainpage3";
import TestPage from "./common/components/TestPage";
import PersonalColorMain from './features/personalcolors/PersonalColorMain';
import Makeup from "./features/makeup/Makeup";
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
        <Route path="/mainpage3" element={<Mainpage3 />} />

        <Route path="/test" element={<TestPage />} />
        <Route path="/personalcolors" element={<PersonalColorMain />} />
        <Route path="/makeup" element={<Makeup />} />
        {/* <Route path="/:id" element={<PersonalDetail />} /> */}
        {/* <Route path="/recommend" element={<Recommend />} />
        
        <Route path="/diagnosis" element={<Diagnosis />} /> */}
      </Routes>
    </Router>
    </RecoilRoot>
    
  );
};

export default App;

