import React from 'react';
import Background from "../../background/background/Background";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/BottomBar";
import PersonalColorDetailContent from "./PersonalColorDetailContent";

const PersonalColorDetail = () => {
  return (
    <Background>
      <Topbar />
      <PersonalColorDetailContent />
      <Bottombar />
    </Background>
  );s
};

export default PersonalColorDetail;
