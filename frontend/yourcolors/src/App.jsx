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
import PersonalColorMain from "./features/personal-colors/PersonalColorMain.jsx";
import PersonalColorDetail from "./features/personal-colors/PersonalColorDetail.jsx";
import MakeupByColor from "./features/makeup/MakeupByColor";
import Makeup from "./features/makeup/Makeup";
import ChoicePage from "./features/choice/ChoicePage.jsx";
import QRTest from "./features/photo/QRTest.jsx";
import QRTestButton from "./features/photo/QRTestButton.jsx";
import { RecoilRoot } from "recoil";
import PersonalDefine from "./features/personal-colors/PersonalDefine.jsx";
import PhotoCapturePage from "./features/season-photo/PhotoCapturePage.jsx";
import PhotoCapturePageTwo from "./features/season-photo/PhotoCapturePageTwo.jsx";
import PhotoSelectionPage from "./features/season-photo/PhotoSelectionPage.jsx";
import PhotoSelectionPageTwo from "./features/season-photo/PhotoSelectionPageTwo.jsx";
import QrCodePage from "./button/print/QRCodePage.jsx";
import QrCodePageTwo from "./button/print/QRCodePageTwo.jsx";
import Qna from "./features/qna/Qna.jsx";
import PhotoQrChoicePage from "./features/season-photo/PhotoQrChoicePage.jsx";
import CosemeticDiagnosis from "./features/cosmetic/CosmeticDiagnosis.jsx";

// 추가: 비활동 상태 관리 Provider, 화면보호기
import { InactivityProvider } from "./hooks/InactivityContext.jsx";
import Screensaver from "./features/screensaver/Screensaver.jsx";
import CosmeticDiagnosis from "./features/cosmetic/CosmeticDiagnosis.jsx";

const App = () => {
  return (
    <RecoilRoot>
      {/* 비활동 상태 전역 관리 */}
      <InactivityProvider>
        {/* 비활동 시 Screensaver 표시 */}
        <Screensaver>
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
              <Route path="/makeupbycolor" element={<MakeupByColor />} />
              <Route path="/choice" element={<ChoicePage />} />
              <Route path="/qrtestbutton" element={<QRTestButton />} />
              <Route path="/qrtest" element={<QRTest />} />
              <Route path="/season-photo" element={<PhotoCapturePage />} />
              <Route path="/season-phototwo" element={<PhotoCapturePageTwo />} />
              <Route path="/select" element={<PhotoSelectionPage />} />
              <Route path="/selecttwo" element={<PhotoSelectionPageTwo />} />
              <Route path="/qr-code" element={<QrCodePage />} />
              <Route path="/qr-codetwo" element={<QrCodePageTwo />} />
              <Route path="/personaldefine" element={<PersonalDefine />} />
              <Route path="/photoqrchoice" element={<PhotoQrChoicePage />} />
              <Route path="/qna" element={<Qna />} />
              <Route path="/cosmeticdiag" element={<CosmeticDiagnosis />} />
            </Routes>
          </Router>
        </Screensaver>
      </InactivityProvider>
    </RecoilRoot>
  );
};

export default App;
