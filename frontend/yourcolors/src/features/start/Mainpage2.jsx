import React from "react";
import Background from "../../background/background/BackGround";
import Smallmain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";

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
