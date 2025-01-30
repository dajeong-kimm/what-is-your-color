import React from "react";
import Background from "./Background/Background";
import Smallmain from "./Background/Smallmain";
import Topbar from "./Topbar";
import Bottombar from "./Bottombar"; // Bottombar 추가

const Mainpage2 = () => {
  return (
    <Background>
      <Smallmain />
      <Topbar />
      <Bottombar />
    </Background>
  );
};

export default Mainpage2;
