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
        ctx.fillStyle = 'rgba(180,122,131, 0.3)'; // 반투명 빨간색으로 채우기
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
    });

    // 기본 얼굴 랜드마크 드로잉
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }, 100);
});
