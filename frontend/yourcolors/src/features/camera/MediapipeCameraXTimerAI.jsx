// ai-model, 얼굴만 보내는 버전
import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../store/UseStore"; //Zustand 상태관리 데이터
import { useModalStore } from "../../store/useModalStore"; // Zustand 모달 상태 가져오기
import DiagFailModalComponent from "../diagnosis/DiagFailModalComponent"; //진단 실패 시 실패 모달

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

let cameraInstance = null; // 카메라 중복 실행 방지용 (전역 변수)

const MediapipeCameraXTimerAI = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null); // Holistic 인스턴스 저장용

  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false); // 이미 촬영했는지 체크

  const navigate = useNavigate();
  const { setUserPersonalId, userImageFile, setUserImageFile, setResults, setGptSummary } = useStore(); //Zustand 상태관리 데이터
  const { openModal } = useModalStore(); // 모달 상태

  useEffect(() => {
    console.log("[useEffect] Component mounted -> Initialize camera");
    initializeCamera();
    // cleanup: 컴포넌트 언마운트 시 카메라 정리
    return () => {
      console.log("[useEffect cleanup] Stopping camera and releasing instances");

      // Camera 인스턴스 종료 (stop() 메서드가 있으면 호출)
      if (cameraInstance && typeof cameraInstance.stop === "function") {
        cameraInstance.stop();
      }
      cameraInstance = null;

      // video 스트림 정리: srcObject에 있는 모든 트랙 종료
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      // Holistic 인스턴스 종료
      if (holisticRef.current && typeof holisticRef.current.close === "function") {
        holisticRef.current.close();
        holisticRef.current = null;
      }
    };
  }, []);

  const initializeCamera = () => {
    console.log("[initializeCamera] called");
    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      refineFaceLandmarks: true,
    });

    holistic.onResults(() => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    });

    if (videoRef.current) {
      // 카메라가 이미 한 번 세팅되었다면 중복 세팅 방지
      console.log("[initializeCamera] Setup camera instance");
      cameraInstance = new Camera(videoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      cameraInstance.start();
    }
  };

  const handleCapture = async () => {
    // 버튼 클릭 시 중복 클릭 방지
    setShowCaptureButton(false);

    console.log("[handleCapture] Start 5s countdown");
    setCapturedImage(null);
    setHasCaptured(false);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          console.log("[handleCapture] Time is up -> capturePhoto()");
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (hasCaptured) {
      console.log("[capturePhoto] Already captured -> skip");
      return;
    }
    setHasCaptured(true); // 이제부터는 중복 촬영 방지

    console.log("[capturePhoto] Capturing now...");
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
        console.log("Captured Image (base64):", imageData);

        setCapturedImage(imageData);
        setCountdown(null);

        // 얼굴 부분 추출
        const faceImage = extractFaceImage(canvas);
        console.log("Extracted Face Image (base64):", faceImage);

        // Base64 → Blob 변환
        const blob = base64ToBlob(faceImage, "image/png");

        // 🟢 상태 업데이트: 유저 이미지 파일 저장
        // setUserImageFile(blob); // ✅ Zustand 상태 업데이트
        // const imageUrl = URL.createObjectURL(blob); // 🔹 blob을 바로 URL로 변환
        // console.log("웃어봐요 활짝", imageUrl);

        // FormData 객체 생성
        const formData = new FormData();
        formData.append("image", blob, "captured_face.png"); // 파일명 지정
        setUserImageFile(formData); // ✅ Zustand 상태 업데이트
        console.log("AI 진단 - 얼굴 이미지 form-data로 저장 완료!!!!");
        formData.forEach((value, key) => {
          console.log(`Key: ${key}, Value:`, value);
        });

        // sendImagesToServer(faceImage); //여기서 실행하면 안된다
      }
    }, 300);
  };

  const extractFaceImage = (canvas) => {
    console.log("[extractFaceImage] Called");
    const faceCanvas = document.createElement("canvas");
    const context = faceCanvas.getContext("2d");

    const faceX = canvas.width * 0.35;
    const faceY = canvas.height * 0.28;
    const faceWidth = canvas.width * 0.3;
    const faceHeight = canvas.height * 0.46;

    faceCanvas.width = faceWidth;
    faceCanvas.height = faceHeight;

    context.drawImage(canvas, faceX, faceY, faceWidth, faceHeight, 0, 0, faceWidth, faceHeight);
    return faceCanvas.toDataURL("image/png");
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

  const sendImagesToServer = (formData) => {
    console.log("[sendImagesToServer] Sending to server...");
    console.log("10. AI 모델 사용 API");

    // // Base64 → Blob 변환
    // const blob = base64ToBlob(faceImageBase64, "image/png");

    // // 🟢 상태 업데이트: 유저 이미지 파일 저장
    // setUserImageFile(blob); // ✅ Zustand 상태 업데이트
    // const imageUrl = URL.createObjectURL(blob); // 🔹 blob을 바로 URL로 변환
    // console.log("웃어봐요 활짝", imageUrl);

    // // FormData 객체 생성
    // const formData = new FormData();
    // formData.append("image", faceImageBase64, "captured_face.png"); // 파일명 지정

    axios
      .post(`${apiBaseUrl}/api/consult/ai`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // form-data 전송을 위한 헤더 설정
        },
      })
      .then((response) => {
        console.log("Server Response(AI 진단 결과):", response.data);
        console.log("너의 색깔은?? : ", response.data.results[0].personal_id);
        setUserPersonalId(response.data.results[0].personal_id);
        setResults(response.data.results); // ✅ Zustand 상태 업데이트 - AI 분석 결과 저장
        setGptSummary(response.data.gpt_summary); // ✅ Zustand 상태 업데이트 - GPT 요약 저장
      })
      .catch((error) => {
        console.error("Error sending images to server:", error);
        
        // 🔴 모달 메시지 상태 업데이트
        openModal("퍼스널컬러 진단에 실패했습니다. 다시 시도해주세요.");

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
      <DiagFailModalComponent /> {/* 진단실패 모달 추가 */}
      {/* 촬영 시 화면 깜빡임 */}
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

      {/* 5초 카운트다운 */}
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
          <img src={capturedImage} alt="Captured" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                  sendImagesToServer(userImageFile); // 서버로 이미지 전송
                  // navigate("/LoadingPage"); // 전송 후 페이지 이동
                  navigate("/LoadingPage", { state: { from: "MediapipeCameraXTimerAI" } }); //진단 실패시 되돌아가기 위해 주소 저장
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
            
            <canvas ref={canvasRef} style={{ display: "none" }} willreadfrequently="true" />
            
          {/* 얼굴 인식 가이드 영역 */}
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
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            얼굴을 가이드라인에 맞게 위치시켜 주세요.
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

export default MediapipeCameraXTimerAI;
