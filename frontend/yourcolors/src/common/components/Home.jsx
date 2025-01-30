import React from "react";
import Background from "./Background/Background";
import Topbutton from "./Topbutton"; // 버튼 재사용

const Home = () => {
  return (
    <Background>
      <div>
        <Topbutton to="/Mainpage" label="시작하기" />
      </div>
    </Background>
  );
};

export default Home;

