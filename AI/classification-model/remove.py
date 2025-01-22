import cv2
import mediapipe as mp
import numpy as np

def remove_background(image_path, output_path):
    # MediaPipe Face Detection 초기화
    mp_face_detection = mp.solutions.face_detection

    # 이미지를 읽어오기
    image = cv2.imread(image_path)
    if image is None:
        print("Image not found!")
        return
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Face Detection 수행
    with mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5) as face_detection:
        results = face_detection.process(image_rgb)
        if not results.detections:
            print("No face detected!")
            return

        # 이미지 크기
        h, w, c = image.shape

        # 기본적으로 투명 배경 생성 (RGBA)
        transparent_image = np.zeros((h, w, 4), dtype=np.uint8)

        # 얼굴 영역 추출 및 마스크 생성
        for detection in results.detections:
            bboxC = detection.location_data.relative_bounding_box
            x_min = int(bboxC.xmin * w)
            y_min = int(bboxC.ymin * h)
            box_width = int(bboxC.width * w)
            box_height = int(bboxC.height * h)

            # 얼굴 영역 비율 기반 여유 공간 확대
            top_ratio = 0.05  # 이마 포함 비율
            bottom_ratio = 0.05  # 턱 포함 비율
            side_ratio = 0.003  # 좌우 여유 공간 비율 (조정된 값)

            x_min = max(int(x_min - box_width * side_ratio), 0)
            y_min = max(int(y_min - box_height * top_ratio), 0)
            x_max = min(int(x_min + box_width + 2 * box_width * side_ratio), w)
            y_max = min(int(y_min + box_height + box_height * bottom_ratio), h)

            # 얼굴 영역 복사 및 투명 배경에 삽입
            transparent_image[y_min:y_max, x_min:x_max, :3] = image[y_min:y_max, x_min:x_max]
            transparent_image[y_min:y_max, x_min:x_max, 3] = 255  # 알파 채널을 255로 설정 (불투명)

        # 결과 저장
        cv2.imwrite(output_path, transparent_image)
        print(f"Result saved to {output_path}")

# 사용 예시
remove_background("C:/Users/SSAFY/Desktop/input3.jpg", "C:/Users/SSAFY/Desktop/output3.png")