import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./features/start/Home";
import MainPage from "./features/start/Mainpage";
import Mainpage2 from "./features/start/Mainpage2";
import DiagCapture from "./features/diagnosis/DiagCapture";
import DiagImage from "./features/diagnosis/DiagImage";
import LoadingPage from "./button/LoadingPage/LoadingPage.jsx";
import TestPage from "./common/components/TestPage";
import PersonalColorMain from "./features/personalcolors/PersonalColorMain";
import Makeup from "./features/makeup/Makeup";
import PersonalColorDetail from "./features/personalcolors/PersonalColorDetail";
import { RecoilRoot } from "recoil";

const App = () => {
  return (
    <RecoilRoot>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/endpage" element={<EndPage />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/mainpage2" element={<Mainpage2 />} />
        <Route path="/diagcapture" element={<DiagCapture />} />
        <Route path="/diagimage" element={<DiagImage />} />
        <Route path="/mediapipecamera" element={<MediapipeCamera />} />
        <Route path="/loadingpage" element={<LoadingPage />} />
        <Route path="/diagresult" element={<DiagResult />} />
        <Route path="/bestworst" element={<BestWorst />} />


        <Route path="/test" element={<TestPage />} />
        <Route path="/personalcolors" element={<PersonalColorMain />} />
        <Route path="/makeup" element={<Makeup />} />
        <Route path="/personalcolors/:id" element={<PersonalColorDetail />} />
        <Route path="/makeupbycolor" element={<MakeupByColor />} />
        {/* <Route path="/recommend" element={<Recommend />} />
        
        {/* <Route path="/recommend" element={<Recommend />} />
        <Route path="/makeup" element={<Makeup />} />
        <Route path="/diagnosis" element={<Diagnosis />} /> */}

       
        

       
        <Route path="/:personalColor/recommend" element={<PersonalRecommend />} />

      </Routes>
    </Router>
    </RecoilRoot>
  );
};

export default App;
