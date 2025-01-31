import React from "react";
import Background from "../../background/background/Background";
import Smallmain from "../../background/background/SmallMain";
import Topbar from "../../buttons/top/Topbar";
import Bottombar from "../../buttons/bottom/Bottombar";

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
