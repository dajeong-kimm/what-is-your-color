import useStore from "../../store/UseStore"; // Zustand 스토어
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const QRTest = () => {
  // Zustand 스토어에서 이미지 파일 가져오기
  const userImageFile = useStore((state) => state.userImageFile);

  // imageBlob을 useMemo로 캐싱: userImageFile이 변경될 때만 재계산
  const imageBlob = useMemo(() => {
    if (userImageFile instanceof FormData) {
      return userImageFile.get("image") || userImageFile.get("face_image");
    } else {
      return userImageFile;
    }
  }, [userImageFile]);

  const [previewUrl, setPreviewUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 컴포넌트 렌더링 시 imageBlob 상태를 로그로 출력
  console.log("QRTest - imageBlob:", imageBlob);

  // 이미지 미리보기 URL 생성
  useEffect(() => {
    console.log("useEffect triggered with imageBlob:", imageBlob);
    if (imageBlob && imageBlob instanceof Blob) {
      const url = URL.createObjectURL(imageBlob);
      setPreviewUrl(url);
      console.log("Preview URL generated:", url);
      return () => URL.revokeObjectURL(url);
    } else {
      console.log("No valid image file found in Zustand.");
    }
  }, [imageBlob]);

  const handleUpload = async () => {
    if (!imageBlob) {
      setError("Zustand에 사진이 등록되어 있지 않습니다.");
      console.log("handleUpload: imageBlob is not present");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", imageBlob);
    console.log("handleUpload: FormData appended with file", imageBlob);

    try {
      // 백엔드 API 엔드포인트 URL을 실제 주소로 수정하세요.
      const response = await axios.post(
        "http://3.35.236.198:9000/api/photos/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;
      console.log("Upload response data:", data);
      setQrCodeUrl(data.qr_code_url);
      setFileUrl(data.file_url);
    } catch (err) {
      setError("업로드에 실패했습니다: " + err.message);
      console.log("handleUpload error:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>QR 코드 & URL 테스트 (기존 사진 사용)</h1>

      {imageBlob ? (
        <div>
          <h2>등록된 사진 미리보기</h2>
          <img
            src={previewUrl}
            alt="등록된 사진"
            style={{ width: "200px", height: "200px" }}
          />
        </div>
      ) : (
        <p>Zustand 스토어에 사진이 등록되어 있지 않습니다.</p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleUpload} disabled={loading || !imageBlob}>
          {loading ? "업로드 중..." : "사진 업로드 및 QR 코드 생성"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {qrCodeUrl && (
        <div>
          <h2>생성된 QR 코드</h2>
          <img
            src={qrCodeUrl}
            alt="QR 코드"
            style={{ width: "200px", height: "200px" }}
          />
        </div>
      )}

      {fileUrl && (
        <div>
          <h2>파일 URL</h2>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};
export default QRTest;
