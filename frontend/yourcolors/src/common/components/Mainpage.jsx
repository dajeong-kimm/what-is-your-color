import React from "react";
import Background from "./Background/Background";
import Largemain from "./Background/Largemain";
import Topbar from "./Topbar";

const Mainpage = () => {
  return (
    <Background>
      <Largemain />
      <Topbar />
    </Background>
  );
};

export default Mainpage;
