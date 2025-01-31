const video = document.getElementById('video')

// 모델 로드 후 startVideo 함수 실행
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(() => {
  console.log('Models loaded successfully');
  startVideo();
});

// 유저의 카메라 권한을 얻기 위한 코드
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.log(err);
    });
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    resizedDetections.forEach(detection => {
      const landmarks = detection.landmarks;
      const mouth = landmarks.getMouth();

      console.log('Mouth landmarks:', mouth);

      if (mouth.length > 0) {
        ctx.fillStyle = 'rgba(216, 96,119, 0.3)'; // 반투명 빨간색으로 채우기
        ctx.beginPath();
        mouth.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.closePath();
        ctx.fill();
      }

      const shadowOffset = 5;  // 눈 위쪽 위치 조정
      const shadowThickness = 5;  // 섀도우 두께

      const drawShadow = (eyePoints) => {
        if (eyePoints.length > 0) {
          const start = eyePoints[0];
          const end = eyePoints[eyePoints.length - 1];

          // 눈 위쪽 경로 조정 (눈머리~눈꼬리 일정한 모양)
          const gradient = ctx.createLinearGradient(start.x-10, start.y, end.x-10, end.y);
          gradient.addColorStop(0, 'rgba(249, 217, 206, 0.2)');
          gradient.addColorStop(1, 'rgba(249, 217, 206, 0.2)');

          ctx.fillStyle = gradient;  // 그라데이션 적용
          ctx.shadowBlur = 100;  // 부드러운 효과
          ctx.shadowColor = 'rgba(249, 217, 206, 0.5)';

          ctx.beginPath();
          ctx.moveTo(start.x - 5, start.y - shadowOffset);
          ctx.quadraticCurveTo(
            eyePoints[Math.floor(eyePoints.length / 2)].x, 
            eyePoints[Math.floor(eyePoints.length / 2)].y - shadowOffset - 5, 
            end.x + 10, end.y - shadowOffset
          );
          ctx.lineTo(end.x + 10, end.y - shadowOffset + shadowThickness);
          ctx.quadraticCurveTo(
            eyePoints[Math.floor(eyePoints.length / 2)].x, 
            eyePoints[Math.floor(eyePoints.length / 2)].y - shadowOffset + 5, 
            start.x - 10, start.y - shadowOffset + shadowThickness
          );
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      };

      // 왼쪽 눈 섀도우 적용
      drawShadow(landmarks.getLeftEye());

      // 오른쪽 눈 섀도우 적용
      drawShadow(landmarks.getRightEye());
    });

    // 기본 얼굴 랜드마크 드로잉
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }, 100);
});
