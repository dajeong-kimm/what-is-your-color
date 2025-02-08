import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./features/start/Home";
import EndPage from "./features/start/EndPage";
import PaperYesNoPage from "./features/start/PaperYesNoPage";
import CheckPage from "./features/start/CheckPage";
import MainPage from "./features/start/MainPage";
import Mainpage2 from "./features/start/MainPage2.jsx";
import DiagCapture from "./features/diagnosis/DiagCapture";
import DiagCaptureX from "./features/diagnosis/DiagCaptureX";
import DiagCaptureXAI from "./features/diagnosis/DiagCaptureXAI";
import DiagImage from "./features/diagnosis/DiagImage";
import MediapipeCamera from "./features/camera/MediapipeCamera.jsx";
import DiagResult from "./features/diagnosis/DiagResult";
import BestWorst from "./features/diagnosis/BestWorst";
import LoadingPage from "./button/loading-page/LoadingPage.jsx";
import TestPage from "./common/components/TestPage";
import PersonalColorMain from './features/personal-colors/PersonalColorMain.jsx';
import PersonalColorDetail from './features/personal-colors/PersonalColorDetail.jsx';
import MakeupByColor from "./features/makeup/MakeupByColor";
import Makeup from "./features/makeup/Makeup";
import MediapipeCameraX from "./features/camera/MediapipeCameraX.jsx";
import PersonalRecommend from "./features/recommend/PersonalRecommend";
import ChoicePage from "./features/choice/ChoicePage.jsx";


// import PersonalColorDetailContent from "./features/personal-colors/detailpractice.jsx";
import { RecoilRoot } from 'recoil';

const App = () => {
  return (
    <RecoilRoot>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/endpage" element={<EndPage />} />
        <Route path="/paperyesnopage" element={<PaperYesNoPage />} />
        <Route path="/checkpage" element={<CheckPage />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/mainpage2" element={<Mainpage2 />} />
        <Route path="/diagcapture" element={<DiagCapture />} />
        <Route path="/diagcapturex" element={<DiagCaptureX />} />
        <Route path="/diagcapturexai" element={<DiagCaptureXAI />} />
        <Route path="/diagimage" element={<DiagImage />} />
        <Route path="/mediapipecamera" element={<MediapipeCamera />} />
        <Route path="/loadingpage" element={<LoadingPage />} />
        <Route path="/diagresult" element={<DiagResult />} />
        <Route path="/bestworst" element={<BestWorst />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/personalcolors" element={<PersonalColorMain />} />
        <Route path="/makeup" element={<Makeup />} />
        <Route path="/personalcolors/:id" element={<PersonalColorDetail />} />
        {/* <Route path="/detail" element={<PersonalColorDetailContent />} /> */}
        <Route path="/makeupbycolor" element={<MakeupByColor />} />
        <Route path="/recommend" element={<PersonalRecommend />} />
        <Route path="/choice" element={<ChoicePage />} />

        <Route path="/result1" element={<DiagResult />} />
        {/* <Route path="/bestworst" element={<BestWorst />} /> */}
        {/* <Route path="/:personalColor/recommend" element={<PersonalRecommend />} /> */}

      </Routes>
    </Router>
    </RecoilRoot>
  );
};

export default App;
