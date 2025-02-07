import numpy as np
import mediapipe as mp
import cv2
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import to_categorical
from sklearn.metrics import classification_report, accuracy_score

# Mediapipe Face Mesh 설정
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)

# LAB 색상 공간에서 평균 색상 추출 함수
def get_average_color(image, center, size_ratio=0.01):
    h, w, _ = image.shape
    size = int(min(h, w) * size_ratio)
    x, y = center
    x_min, x_max = max(0, x - size // 2), min(w, x + size // 2)
    y_min, y_max = max(0, y - size // 2), min(h, y + size // 2)
    region = image[y_min:y_max, x_min:x_max]

    if region.size > 0:
        converted = cv2.cvtColor(region, cv2.COLOR_BGR2LAB)
        return np.mean(converted, axis=(0, 1))
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

# 테스트 데이터 로드 함수
def load_test_data(dataset_path, categories):
    data, labels = [], []
    for label, category in enumerate(categories):
        category_path = os.path.join(dataset_path, category)
        for file_name in os.listdir(category_path):
            file_path = os.path.join(category_path, file_name)
            image = cv2.imread(file_path)
            if image is not None:
                features = extract_features(image)  # 동일한 특징 추출 함수 사용
                if features is not None:
                    data.append(features)
                    labels.append(label)
    return np.array(data), np.array(labels)

# 테스트 데이터 경로
test_path = r"C:\Users\SSAFY\Desktop\dataset_split\test"
categories = [
    "autumn_dark", "autumn_muted", "autumn_strong",
    "spring_light", "spring_bright", "spring_vivid",
    "summer_light", "summer_muted", "summer_bright",
    "winter_dark", "winter_strong", "winter_vivid"
]

# 테스트 데이터 로드
X_test, y_test = load_test_data(test_path, categories)
y_test_categorical = to_categorical(y_test, num_classes=len(categories))

# 최적의 모델 로드 (가장 높은 val_accuracy를 기록한 모델)
best_model_path = "personal_color_classifier.h5"
model = load_model(best_model_path)

# 모델 평가
test_loss, test_accuracy = model.evaluate(X_test, y_test_categorical, verbose=1)
print(f"✅ 테스트 데이터 정확도: {test_accuracy * 100:.2f}%")

# 모델 예측
y_pred = np.argmax(model.predict(X_test), axis=1)

# 정밀도, 재현율, F1-score 출력
print("\n📊 분류 리포트 (Classification Report)")
print(classification_report(y_test, y_pred, target_names=categories))

# 정확도 출력
print(f"\n📈 최종 테스트 정확도: {accuracy_score(y_test, y_pred) * 100:.2f}%")


