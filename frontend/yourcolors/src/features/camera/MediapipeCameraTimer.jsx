// color-distance, 얼굴, 종이 다 보내는 버전
import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../button/loading-page/LoadingPage";
import axios from "axios";
import useStore from "../../store/UseStore"; //Zustand 상태관리 데이터
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const MediapipeCameraTimer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [a4Blob, setA4Blob] = useState(null); //버튼에서 사용해야 해서 useState로 관리

  const navigate = useNavigate();
  const {
    setUserPersonalId,
    userImageFile,
    setUserImageFile,
    setResults,
    setGptSummary,
  } = useStore(); //Zustand 상태관리 데이터

  useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = () => {
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      refineFaceLandmarks: true,
    });

    holistic.onResults(() => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  };

  const handleCapture = async () => {
    setCapturedImage(null);
    setCountdown(5);
    setShowCaptureButton(false);

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

  const capturePhoto = () => {
    setIsFlashing(true);

    setTimeout(() => {
      setIsFlashing(false);
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video) {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        // 전체 캡처한 이미지
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        setCountdown(null);

        const faceImage = extractFaceImage(canvas);
        const a4Image = extractA4Image(canvas);

        console.log("Face Image Data:", faceImage);
        console.log("A4 Image Data:", a4Image);


        // Base64 → Blob 변환
        const faceBlob = base64ToBlob(faceImage, "image/png");
        setA4Blob(base64ToBlob(a4Image, "image/png")); //버튼에서 사용해야 해서 useState로 관리리
        // const a4Blob = base64ToBlob(a4Image, "image/png");

        // 🟢 상태 업데이트: 유저 이미지 파일 저장
        setUserImageFile(faceBlob); // ✅ Zustand 상태 업데이트
        const imageUrl = URL.createObjectURL(faceBlob); // 🔹 blob을 바로 URL로 변환
        console.log("웃어봐요 활짝", imageUrl);


        // sendImagesToServer(faceImage, a4Image); //여기서 실행하면 안된다.
      }
    }, 300);
  };

  const extractFaceImage = (canvas) => {
    const faceCanvas = document.createElement("canvas");
    const context = faceCanvas.getContext("2d");

    const faceX = canvas.width * 0.35;
    const faceY = canvas.height * 0.28;
    const faceWidth = canvas.width * 0.3;
    const faceHeight = canvas.height * 0.46;

    faceCanvas.width = faceWidth;
    faceCanvas.height = faceHeight;

    context.drawImage(
      canvas,
      faceX,
      faceY,
      faceWidth,
      faceHeight,
      0,
      0,
      faceWidth,
      faceHeight
    );

    return faceCanvas.toDataURL("image/png");
  };

  const extractA4Image = (canvas) => {
    const a4Canvas = document.createElement("canvas");
    const context = a4Canvas.getContext("2d");

    const a4X = canvas.width * 0.7;
    const a4Y = canvas.height * 0.3;
    const a4Width = canvas.width * 0.15;
    const a4Height = canvas.height * 0.4;

    a4Canvas.width = a4Width;
    a4Canvas.height = a4Height;

    context.drawImage(
      canvas,
      a4X,
      a4Y,
      a4Width,
      a4Height,
      0,
      0,
      a4Width,
      a4Height
    );

    return a4Canvas.toDataURL("image/png");
  };

  // 🔥 Base64 -> Blob 변환 함수
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const sendImagesToServer = (faceImageBase64, a4ImageBase64) => {
    console.log("[sendImagesToServer] Sending to server...");
    console.log("11. 색상 거리 사용 API");

    // // Base64 → Blob 변환
    // const faceBlob = base64ToBlob(faceImageBase64, "image/png");
    // const a4Blob = base64ToBlob(a4ImageBase64, "image/png");

    // // 🟢 상태 업데이트: 유저 이미지 파일 저장
    // setUserImageFile(faceBlob); // ✅ Zustand 상태 업데이트
    // const imageUrl = URL.createObjectURL(faceBlob); // 🔹 blob을 바로 URL로 변환
    // console.log("웃어봐요 활짝", imageUrl);

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("face_image", faceImageBase64, "face_image.png"); // 얼굴 이미지 추가
    formData.append("a4_image", a4ImageBase64, "a4_image.png"); // 종이 이미지 추가

    axios
      .post(`${apiBaseUrl}/api/consult/dist`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Server Response(색상거리 종이있음):", response.data);
        console.log("너의 색깔은?? : ", response.data.results[0].personal_id);
        setUserPersonalId(response.data.results[0].personal_id);
        setResults(response.data.results); // ✅ Zustand 상태 업데이트 - AI 분석 결과 저장
        setGptSummary(response.data.gpt_summary); // ✅ Zustand 상태 업데이트 - GPT 요약 저장
      })
      .catch((error) => {
        console.error("Error sending images to server:", error);
        alert("퍼스널컬러 진단에 실패했습니다. 화면에 맞춰서 다시 시도해주세요.");
        navigate(-1); // 🔴 이전 페이지로 이동
      });
  };

  const handleRetake = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        width: "100%",
        height: "115%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isFlashing && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            opacity: 0.8,
            transition: "opacity 0.3s",
            zIndex: 20,
          }}
        />
      )}

      {countdown !== null && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "4rem",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "1.5rem 3rem",
            borderRadius: "15px",
            zIndex: 10,
          }}
        >
          {countdown}
        </div>
      )}

      {capturedImage ? (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "5%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              padding: "0 5%",
            }}
          >
            <button
              onClick={handleRetake}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
                backgroundColor: "#82DC28",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transform: "translateX(-65%)",
              }}
            >
              다시 촬영하기
            </button>
            <button
              onClick={() => {
                if (userImageFile) {
                    setResults([]); // ✅ Zustand 상태 업데이트
                    setGptSummary(""); // ✅ Zustand 상태 업데이트
                    sendImagesToServer(userImageFile, a4Blob); // 서버로 이미지 전송
                    // navigate("/LoadingPage"); // 전송 후 페이지 이동
                    navigate("/LoadingPage", { state: { from: "MediapipeCameraTimer" } }) //진단 실패시 되돌아가기 위해 주소 저장
                  }
                }}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
                backgroundColor: "#82DC28",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transform: "translateX(-15%)",
              }}
            >
              진단하기
            </button>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            willreadfrequently="true"
          />

          <div
            style={{
              position: "absolute",
              border: "8px dashed yellow",
              width: "30%",
              height: "70%",
              top: "15%",
              left: "35%",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              border: "6px dashed yellow",
              width: "15%",
              height: "50%",
              top: "20%",
              left: "70%",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "1%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            얼굴을 가이드라인에 맞게 위치시키고, <br />
            네모 영역에 맞추어 종이를 들어주세요.
          </div>

          {showCaptureButton && (
            <div
              style={{
                position: "absolute",
                bottom: "40%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <button
                onClick={handleCapture}
                style={{
                  padding: "1.2rem 2.5rem",
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  backgroundColor: "#82DC28",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                촬영하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MediapipeCameraTimer;
