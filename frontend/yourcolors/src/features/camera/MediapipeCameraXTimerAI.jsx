// ai-model, 얼굴만 보내는 버전
import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
// import { Camera } from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../store/UseStore"; //Zustand 상태관리 데이터
import { useModalStore } from "../../store/useModalStore"; // Zustand 모달 상태 가져오기
import DiagFailModalComponent from "../diagnosis/DiagFailModalComponent"; //진단 실패 시 실패 모달
import useWebcamStore from "../../store/useWebcamStore"; // Zustand 카메라 상태 관리

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const MediapipeCameraXTimerAI = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null); // Holistic 인스턴스 저장용

  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false); // 이미 촬영했는지 체크
  const [faceBlob, setFaceBlob] = useState(null);

  const navigate = useNavigate();
  const {
    userPersonalId,
    setUserPersonalId,
    fetchPersonalColorDetails,
    userImageFile,
    setUserImageFile,
    setResults,
    gptSummary,
    setGptSummary,
    setQrImage,
  } = useStore(); //Zustand 상태관리 데이터
  const { openModal } = useModalStore(); // 모달 상태
  const { stream, startCamera, stopCamera } = useWebcamStore();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      // videoRef.current
      //   .play()
      //   .catch((error) => console.error("Play 오류:", error));
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => stopCamera(); // 컴포넌트 언마운트 시 카메라 정지
  }, [startCamera, stopCamera]);

  useEffect(() => {
    const setupHolistic = async () => {
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
        if (!canvasRef.current || !videoRef.current) return;
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
      holisticRef.current = holistic;
    };

    setupHolistic();
  }, []);

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
    setHasCaptured(true);

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

        const imageData = canvas.toDataURL("image/png");
        console.log("Captured Image (base64):", imageData);
        setCapturedImage(imageData);
        setCountdown(null);

        // 얼굴 부분 추출
        const faceImage = extractFaceImage(canvas);
        console.log("Extracted Face Image (base64):", faceImage);

        // Base64 → Blob 변환
        const blob = base64ToBlob(faceImage, "image/png");
        // faceBlob 상태 업데이트 (두 API에서 사용)
        setFaceBlob(blob);

        // FormData 객체 생성하여 Zustand에 저장 (원래 사용하던 방식)
        const formData = new FormData();
        formData.append("image", blob, "captured_face.png");
        setUserImageFile(formData);

        console.log("AI 진단 - 얼굴 이미지 form-data로 저장 완료!!!!");
        formData.forEach((value, key) => {
          console.log(`Key: ${key}, Value:`, value);
        });
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

  const sendImagesToServer = async (formData) => {
    try {
      // 10. AI 진단 API 호출
      const aiResponse = await axios.post(
        `${apiBaseUrl}/api/consult/ai`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Server Response (AI 진단 결과):", aiResponse.data);

      // 상태 업데이트
      setUserPersonalId(aiResponse.data.results[0].personal_id); //여기에 User의 퍼스널컬러 ID 저장, userPersonalId가져다 써야함
      setResults(aiResponse.data.results);
      setGptSummary(aiResponse.data.gpt_summary); // GPT 진단 결과 저장, getSummary 꺼 써야함함

      fetchPersonalColorDetails(userPersonalId); //퍼스널 id에 맞는 퍼스널컬러 상세정보 최신화


      // 2. QR 생성 API 호출을 위한 formData 구성
      const qrFormData = new FormData();
      // 촬영 시 저장한 faceBlob을 사용 (이미 저장해두어야 합니다)
      qrFormData.append("imageUrl", faceBlob, "captured_face.png");

      // AI 결과에서 필요한 컬러 정보가 있다면 이를 사용하고, 없으면 기본값 지정
      // const result = aiResponse.data.results[0];
      qrFormData.append("bestColor", aiResponse.data.results[0].personal_color);
      qrFormData.append("subColor1", aiResponse.data.results[1].personal_color);
      qrFormData.append("subColor2", aiResponse.data.results[2].personal_color);
      qrFormData.append("message", gptSummary);
      
      // console.log("준수의 qr폼 테스트", aiResponse.data.results[0].personal_color);
      // console.log("준수의 qr폼 테스트", aiResponse.data.results[1].personal_color);
      // console.log("준수의 qr폼 테스트", aiResponse.data.results[2].personal_color);


      // 3. QR API 호출
      const qrResponse = await axios.post(
        `${apiBaseUrl}/api/result/qr`,
        qrFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("QR Response:", qrResponse.data);

      // QR 이미지를 Zustand에 저장
      setQrImage(qrResponse.data.qr_url);
    } catch (error) {
      console.error("Error sending images to server:", error);
      openModal("퍼스널컬러 진단에 실패했습니다. 다시 시도해주세요.");
      navigate(-1);
    }
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
                if (userImageFile && faceBlob) {
                  setResults([]); // 기존 AI 결과 초기화
                  setGptSummary("");
                  sendImagesToServer(userImageFile); // 두 API를 순차적으로 호출
                  navigate("/LoadingPage", {
                    state: { from: "MediapipeCameraXTimerAI" },
                  });
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
