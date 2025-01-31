import React from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/Topbar";

const Mainpage = () => {
  return (
    <Background>
      <Largemain />
      <Topbar />
    </Background>
  );
};

export default Mainpage;
