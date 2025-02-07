import cv2
import numpy as np
import mediapipe as mp

# Mediapipe Face Mesh 설정
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)

# 랜드마크 기반 ROI 색상 추출 함수
def get_average_color(image, center, size_ratio=0.01):
    """
    특정 중심 좌표 기반으로 ROI 색상을 추출합니다.
    :param image: 입력 이미지
    :param center: ROI 중심 좌표 (픽셀 단위)
    :param size_ratio: ROI 크기를 이미지 크기에 비례하여 설정
    :return: 평균 RGB 값
    """
    h, w, _ = image.shape
    size = int(min(h, w) * size_ratio)  # 이미지 크기에 비례한 ROI 크기 계산
    x, y = center
    x_min, x_max = max(0, x - size // 2), min(w, x + size // 2)
    y_min, y_max = max(0, y - size // 2), min(h, y + size // 2)
    region = image[y_min:y_max, x_min:x_max]
    if region.size > 0:
        return np.mean(region, axis=(0, 1))  # 평균 RGB 계산
    return [0, 0, 0]

# 랜드마크 기반 중간 좌표 계산 함수
def get_midpoint(landmarks, index1, index2, h, w):
    """
    두 랜드마크의 중간 좌표를 계산합니다.
    :param landmarks: Mediapipe 랜드마크 리스트
    :param index1: 첫 번째 랜드마크 인덱스
    :param index2: 두 번째 랜드마크 인덱스
    :param h: 이미지 높이
    :param w: 이미지 너비
    :return: 중간 좌표 (x, y)
    """
    x = int((landmarks[index1].x + landmarks[index2].x) / 2 * w)
    y = int((landmarks[index1].y + landmarks[index2].y) / 2 * h)
    return (x, y)

# 얼굴 특징 추출 함수
def extract_features(image):
    """
    얼굴의 주요 특징 색상을 추출하고 ROI를 시각화합니다.
    :param image: 입력 이미지
    :return: 특징 색상 딕셔너리
    """
    results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    if not results.multi_face_landmarks:
        print("얼굴을 감지할 수 없습니다.")
        return None

    for face_landmarks in results.multi_face_landmarks:
        landmarks = face_landmarks.landmark
        h, w, _ = image.shape
        features = {}

        # 랜드마크 ID와 중심 좌표 정의 (눈동자는 중간 좌표로 계산)
        landmark_map = {
            "skin_color": [1],  # 얼굴 중앙
            "left_eye_color": (33, 133),  # 왼쪽 눈 양끝
            "right_eye_color": (362, 263),  # 오른쪽 눈 양끝
            "hair_color": [10],  # 이마
            "lips_color": [13],  # 입술 중앙
            "cheek_left_color": [234],  # 왼쪽 뺨
            "cheek_right_color": [454],  # 오른쪽 뺨
        }

        for feature, indices in landmark_map.items():
            try:
                if feature in ["left_eye_color", "right_eye_color"]:
                    # 눈동자의 양끝을 기준으로 중간 좌표 계산
                    center = get_midpoint(landmarks, indices[0], indices[1], h, w)
                else:
                    # 다른 특징은 랜드마크의 첫 번째 값을 사용
                    center = (int(landmarks[indices[0]].x * w), int(landmarks[indices[0]].y * h))

                features[feature] = get_average_color(image, center, size_ratio=0.03)

                # ROI 시각화
                size = int(min(h, w) * 0.02)  # 시각화용 사각형 크기
                x_min, x_max = max(0, center[0] - size // 2), min(w, center[0] + size // 2)
                y_min, y_max = max(0, center[1] - size // 2), min(h, center[1] + size // 2)
                color = tuple(map(int, features[feature]))  # 추출된 색상
                cv2.rectangle(image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)  # 초록색 ROI
                cv2.rectangle(image, (x_min, y_min - 20), (x_min + 20, y_min), color, -1)  # 추출된 색상 표시
            except IndexError:
                print(f"특징 '{feature}'의 랜드마크가 부족하여 추출할 수 없습니다.")
                continue

        return features
    return None

# 테스트 이미지 경로
test_image_path = r"C:\Users\SSAFY\Desktop\test_image.png"  # 테스트 이미지 경로

# 이미지 로드
image = cv2.imread(test_image_path)

# 얼굴 특징 추출 및 테스트
if image is not None:
    features = extract_features(image)
    if features:
        print("추출된 얼굴 특징:")
        for key, value in features.items():
            print(f"{key}: RGB {value}")

        # OpenCV 창으로 결과 바로 표시
        cv2.imshow("Facial Features with ROI", image)
        cv2.waitKey(0)  # 키 입력 대기
        cv2.destroyAllWindows()
    else:
        print("이미지에서 특징을 추출할 수 없습니다.")
else:
    print("이미지를 로드할 수 없습니다.")
