import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./features/start/Home";
import Mainpage from "./features/start/Mainpage";
import Mainpage2 from "./features/start/Mainpage2";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/mainpage2" element={<Mainpage2 />} />
        {/* <Route path="/recommend" element={<Recommend />} />
        <Route path="/makeup" element={<Makeup />} />
        <Route path="/personalcolors" element={<Personalcolors />} />
        <Route path="/diagnosis" element={<Diagnosis />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
