import os
import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import ModelCheckpoint
from sklearn.model_selection import train_test_split

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

# 데이터셋 경로
train_path = r"C:\Users\SSAFY\Desktop\dataset_split\train"
val_path = r"C:\Users\SSAFY\Desktop\dataset_split\val"
categories = [
    "autumn_dark", "autumn_muted", "autumn_strong",
    "spring_light", "spring_bright", "spring_vivid",
    "summer_light", "summer_muted", "summer_bright",
    "winter_dark", "winter_strong", "winter_vivid"
]

X_train, y_train = load_data(train_path, categories)
X_val, y_val = load_data(val_path, categories)

# 모델 설계 및 학습
input_dim = X_train.shape[1]
model = Sequential([
    Dense(128, activation='relu', input_shape=(input_dim,)),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dense(len(categories), activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# 모델 체크포인트 저장
checkpoint = ModelCheckpoint("personal_color_classifier.h5", save_best_only=True, monitor='val_accuracy', mode='max')
model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=50, batch_size=32, callbacks=[checkpoint])

print("모델 학습 완료 및 저장 완료.")
