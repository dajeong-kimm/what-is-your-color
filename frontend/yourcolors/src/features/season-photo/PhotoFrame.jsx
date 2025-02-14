import React,{useState} from "react";
import Background from "../../background/background/Background";
import Largemain from "../../background/background/LargeMain";
import Topbar from "../../button/top/TopBar";
import { useLocation } from "react-router-dom";
import "../start/MainPage.css";
import "./PhotoFrame.css";
import PersonalColorInfo from "../../store/PersonalColorInfo"; 
import useStore from "../../store/UseStore"; // Zustand 상태관리 사용 (필요시 활용)

const PhotoFrame = ({ selectedPhotos = [] }) => {
  const { userPersonalId } = useStore();
  const [num, setNum] = useState(userPersonalId); // 현재 표시할 콘텐츠 상태
  
    // 콘텐츠 변경 로직 (좌우 버튼)
    const nextNum = () => {
      setNum((num) => (num + 1 + 12) % 12);
    };
  
    const prevNum = () => {
      setNum((num) => (num - 1 + 12) % 12);
    };

  console.log(PersonalColorInfo[userPersonalId].colorClass);
  return (
    <div className="photo-booth-container" style={{ display: "flex", justifyContent: "center" }}>
      <div className="photo-booth" style={{ border: "8px solid black", padding: "8px", backgroundColor: "black", display: "flex", flexDirection: "column", marginTop: "50px", marginBottom: "40px", marginRight: "50px", alignItems: "center", gap: "10px", width: "140px", position: "relative" }}>
        <div className="side-text" style={{ position: "absolute", left: "-8px", top: "25%", transform: "translateY(-50%)", writingMode: "sideways-lr", color: "white", fontSize: "9px", fontWeight: "bold" }}>your colors</div>
        <div className="side-text" style={{ position: "absolute", right: "-8px", top: "25%", transform: "translateY(-50%)", writingMode: "sideways-rl", color: "white", fontSize: "9px", fontWeight: "bold" }}>your colors</div>
        <div className="side-text" style={{ position: "absolute", left: "-8px", bottom: "35%", transform: "translateY(-50%)", writingMode: "sideways-lr", color: "white", fontSize: "9px", fontWeight: "bold" }}>your colors</div>
        <div className="side-text" style={{ position: "absolute", right: "-8px", bottom: "35%", transform: "translateY(-50%)", writingMode: "sideways-rl", color: "white", fontSize: "9px", fontWeight: "bold" }}>your colors</div>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="photo-slot"
            style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "white", border: "4px solid black", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40px" }}
          >
            {selectedPhotos[idx] ? (
              <img
                src={selectedPhotos[idx]}
                alt={`선택된 사진 ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "10px", visibility: "hidden" }}>빈 슬롯</span>
            )}
          </div>
        ))}
        <div className="photo-booth-footer" style={{ textAlign: "center", marginTop: "20px", color: "white", width: "100%", padding: "10px 0" }}>
          <div className="photo-booth-text" style={{ fontSize: "15px", fontWeight: "bold", fontFamily: "cursive", fontStyle: "italic", marginTop: "-30px" }}>{PersonalColorInfo[num].colorClass}</div>
          <div className="photo-booth-text" style={{ fontSize: "23px", fontWeight: "bold" }}>계절네컷</div>
        </div>
      </div>
    </div>
  );
};

export default PhotoFrame;
