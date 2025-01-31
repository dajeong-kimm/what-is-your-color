import { atom } from "recoil";
import PersonalColors from "../data/PersonalColors";

// Recoil 상태 (퍼스널컬러 데이터 저장)
export const PersonalColorState = atom({
  key: "PersonalColorState",
  default: PersonalColors, // 기본값을 data에서 불러오기
});
