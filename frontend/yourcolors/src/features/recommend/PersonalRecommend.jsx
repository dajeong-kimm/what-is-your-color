import React from "react";
import Background from "../../background/background/Background";
import SmallMain from "../../background/background/SmallMain";
import Topbar from "../../button/top/TopBar";
import Bottombar from "../../button/bottom/Bottombar";
import ProductButton from "../../button/productbutton/ProductButton";

const PersonalRecommend = () => {
  return (
    <Background>
      <Topbar />
      <SmallMain>
        <div className="full-container">
          <div className="top">
            <div className="color-pick"></div>
            <div className="button-container">
              <ProductButton text="립" />
              <ProductButton text="아이섀도우" />
              <ProductButton text="치크" />
            </div>
          </div>
					<div className="product-container">

					</div>
        </div>
      </SmallMain>
      <Bottombar />
    </Background>
  );
};

export default PersonalRecommend;
