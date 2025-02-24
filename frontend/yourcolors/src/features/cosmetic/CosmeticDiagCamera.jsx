import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../store/UseStore";
// useModalStore 대신 로컬 modalContent state를 사용합니다.
import useWebcamStore from "../../store/useWebcamStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const CosmeticDiagCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [showDiagnoseButton, setShowDiagnoseButton] = useState(false);
  const [showRetakeButton, setShowRetakeButton] = useState(false);
  // 모달 내용 state를 추가합니다.
  const [modalContent, setModalContent] = useState(null);

  const navigate = useNavigate();
  const { setResults } = useStore();
  const { stream, startCamera, stopCamera } = useWebcamStore();

  // 컴포넌트 마운트 시 localStorage에서 캡처한 이미지 복원
  useEffect(() => {
    const storedImage = localStorage.getItem("capturedImage");
    if (storedImage) {
      setCapturedImage(storedImage);
      // 만약 videoRef가 존재하면, 영상은 정지상태로 둡니다.
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setShowDiagnoseButton(true);
      setShowRetakeButton(true);
      setShowCaptureButton(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
    console.log("촬영 버튼 클릭됨, 3초 카운트다운 시작");
    setCountdown(3);
    setShowCaptureButton(false);
    setShowRetakeButton(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 전체 비디오 화면을 캡처하여 이미지 데이터로 생성합니다.
  const capturePhoto = () => {
    const video = videoRef.current;
    if (video) {
      console.log("전체 화면 캡처 시작:", {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });
      const fullCanvas = document.createElement("canvas");
      fullCanvas.width = video.videoWidth;
      fullCanvas.height = video.videoHeight;
      const ctx = fullCanvas.getContext("2d");
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const fullImageData = fullCanvas.toDataURL("image/png");
      setCapturedImage(fullImageData);
      // 저장: localStorage에 캡처한 이미지를 저장합니다.
      localStorage.setItem("capturedImage", fullImageData);
      // video를 정지하여 마지막 프레임을 그대로 보여줍니다.
      video.pause();
      setShowDiagnoseButton(true);
      setShowRetakeButton(true);
      console.log("전체 화면 캡처 및 영상 정지 완료");
    }
  };

  // dataURL을 Blob으로 변환하는 헬퍼 함수
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // 캡처한 이미지를 서버에 전송하고, 응답 데이터를 모달로 차트 형태로 표시하는 함수
  const sendImageToServer = () => {
    if (!capturedImage) {
      setModalContent("이미지가 캡쳐되지 않았습니다. 다시 촬영해주세요.");
      return;
    }
    console.log("진단하기 버튼 클릭됨. 서버에 이미지 전송 시작");
    const formData = new FormData();
    const imageBlob = dataURLtoBlob(capturedImage);
    formData.append("lip_image", imageBlob, "image.png");

    axios
      .post(`${apiBaseUrl}/api/cosmetic/lip`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("서버 응답:", response.data);
        const diagnosis = response.data.diagnosis;
        // rank 오름차순 정렬
        const sortedDiagnosis = diagnosis.sort((a, b) => a.rank - b.rank);
        // 진단 항목들만 모달에 출력합니다.
        setModalContent(
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sortedDiagnosis.map((item, index) => {
                const probabilityNum = parseFloat(item.probability);
                // rank가 1인 항목은 색상을 #0d662e로, 그 외에는 #82DC28 사용
                const barColor = parseInt(item.rank, 10) === 1 ? "#0d662e" : "#82DC28";
                return (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "120px" }}>{item.personal_color}</span>
                    <div
                      style={{
                        height: "20px",
                        backgroundColor: barColor,
                        width: `${probabilityNum * 3}px`,
                      }}
                    />
                    <span style={{ marginLeft: "10px" }}>{item.probability}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response status:", error.response.status);
          console.error("Error response data:", error.response.data);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
        console.error("Error sending image to server:", error);
        setModalContent("진단에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleDiagnose = () => {
    console.log("진단하기 버튼 클릭됨");
    if (capturedImage) {
      sendImageToServer();
    } else {
      setModalContent("이미지가 캡쳐되지 않았습니다. 다시 촬영해주세요.");
    }
  };

  const handleRetake = () => {
    console.log("다시 촬영하기 버튼 클릭됨");
    if (videoRef.current) {
      videoRef.current.play();
    }
    setCapturedImage(null);
    localStorage.removeItem("capturedImage");
    setShowDiagnoseButton(false);
    setShowCaptureButton(true);
    setShowRetakeButton(false);
    setCountdown(null);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 조건부 렌더링: 캡처한 이미지가 있으면 <img>로, 없으면 video로 전체 화면 표시 */}
      {capturedImage ? (
        <img
          src={capturedImage}
          alt="Captured"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)", // 좌우 대칭 처리
          }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
        />
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Face guideline */}
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "300px",
          border: "8px dashed yellow",
          borderRadius: "0%",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* Alignment guidance text */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "39%",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "8px 12px",
          borderRadius: "8px",
        }}
      >
        화장품을 가이드라인에 맞춰주세요
      </div>

      {/* Countdown display */}
      {countdown !== null && (
        <div
          style={{
            position: "absolute",
            bottom: "45%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "50px",
            fontWeight: "bold",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "12px 12px",
            borderRadius: "8px",
          }}
        >
          {countdown}
        </div>
      )}

      {/* Capture button */}
      {showCaptureButton && (
        <button
          onClick={handleCapture}
          disabled={!showCaptureButton}
          style={{
            position: "absolute",
            bottom: "11%",
            backgroundColor: "#82DC28",
            color: "white",
            left: "45.5%",
            border: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          촬영하기
        </button>
      )}

      {/* Retake button */}
      {showRetakeButton && (
        <button
          onClick={handleRetake}
          style={{
            position: "absolute",
            bottom: "11%",
            backgroundColor: "#82DC28",
            left: "35%",
            border: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          다시 촬영하기
        </button>
      )}

      {/* Diagnose button */}
      {showDiagnoseButton && (
        <button
          onClick={handleDiagnose}
          style={{
            position: "absolute",
            bottom: "11%",
            left: "59%",
            transform: "translateX(-50%)",
            backgroundColor: "#0d662e",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          진단하기
        </button>
      )}

      {/* 모달 표시 */}
      {modalContent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              border: "15px solid #D2F096",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "hidden",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* 닫기 (X) 버튼 */}
            <button
              onClick={() => setModalContent(null)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#333",
              }}
            >
              ✖
            </button>
            {/* 모달 내용 - 진단 결과와 립 컬러 항목은 제외 */}
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              진단 결과
            </h2>
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmeticDiagCamera;
