import cv2
import numpy as np
from tensorflow.keras.models import load_model
import os
import mediapipe as mp
from tensorflow.keras.utils import to_categorical

# Mediapipe 설정 및 함수 동일
# (train.py의 Mediapipe 설정 및 `extract_features` 함수 복사)
# Mediapipe Face Mesh 설정
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)

# 랜드마크 기반 ROI 색상 추출 함수
def get_average_color(image, center, size_ratio=0.01):
    h, w, _ = image.shape
    size = int(min(h, w) * size_ratio)
    x, y = center
    x_min, x_max = max(0, x - size // 2), min(w, x + size // 2)
    y_min, y_max = max(0, y - size // 2), min(h, y + size // 2)
    region = image[y_min:y_max, x_min:x_max]
    if region.size > 0:
        return np.mean(region, axis=(0, 1))
    return [0, 0, 0]

# 랜드마크 기반 중간 좌표 계산 함수
def get_midpoint(landmarks, index1, index2, h, w):
    x = int((landmarks[index1].x + landmarks[index2].x) / 2 * w)
    y = int((landmarks[index1].y + landmarks[index2].y) / 2 * h)
    return (x, y)

# 얼굴 특징 추출 함수
def extract_features(image):
    results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    if not results.multi_face_landmarks:
        return None

    for face_landmarks in results.multi_face_landmarks:
        landmarks = face_landmarks.landmark
        h, w, _ = image.shape
        features = []

        landmark_map = {
            "skin_color": [1],
            "left_eye_color": (33, 133),
            "right_eye_color": (362, 263),
            "hair_color": [10],
            "lips_color": [13],
            "cheek_left_color": [234],
            "cheek_right_color": [454],
        }

        for feature, indices in landmark_map.items():
            try:
                if feature in ["left_eye_color", "right_eye_color"]:
                    center = get_midpoint(landmarks, indices[0], indices[1], h, w)
                else:
                    center = (int(landmarks[indices[0]].x * w), int(landmarks[indices[0]].y * h))
                color = get_average_color(image, center, size_ratio=0.03)
                features.extend(color)
            except IndexError:
                continue
        return np.array(features)
    return None

# 데이터 로드 및 준비
def load_data(dataset_path, categories):
    data = []
    labels = []
    for label, category in enumerate(categories):
        category_path = os.path.join(dataset_path, category)
        for file_name in os.listdir(category_path):
            file_path = os.path.join(category_path, file_name)
            image = cv2.imread(file_path)
            if image is not None:
                features = extract_features(image)
                if features is not None:
                    data.append(features)
                    labels.append(label)
    return np.array(data), to_categorical(np.array(labels), num_classes=len(categories))


# 모델 로드
model = load_model("personal_color_classifier.h5")
categories = [
    "autumn_dark", "autumn_muted", "autumn_strong",
    "spring_light", "spring_bright", "spring_vivid",
    "summer_light", "summer_muted", "summer_bright",
    "winter_dark", "winter_strong", "winter_vivid"
]

# 테스트 데이터셋 로드
test_path = r"C:\Users\SSAFY\Desktop\dataset_split\test"
X_test, y_test = load_data(test_path, categories)

# 모델 성능 평가
loss, accuracy = model.evaluate(X_test, y_test)
print(f"테스트 데이터 정확도: {accuracy:.2f}")

# 테스트 이미지 개별 예측
test_image_path = r"C:\Users\SSAFY\Desktop\test_image.png"
image = cv2.imread(test_image_path)

if image is not None:
    features = extract_features(image)
    if features is not None:
        features = features.reshape(1, -1)
        predictions = model.predict(features)
        predicted_index = np.argmax(predictions)
        confidence = predictions[0][predicted_index]
        predicted_label = categories[predicted_index]

        print(f"예측된 퍼스널 컬러: {predicted_label}")
        print(f"신뢰도: {confidence:.2f}")

        # 상위 3개 출력
        top_3_indices = predictions[0].argsort()[-3:][::-1]
        print("상위 3개의 퍼스널 컬러:")
        for i, index in enumerate(top_3_indices):
            print(f"{i+1}위: {categories[index]} (확률: {predictions[0][index]:.2f})")
else:
    print("이미지를 로드할 수 없습니다.")
