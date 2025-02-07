import os
import cv2
import mediapipe as mp
import numpy as np
import time
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import KFold

# Mediapipe Face Mesh 설정
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, min_detection_confidence=0.5)

# 얼굴 특정 영역 크롭 함수
def crop_face_regions(image):
    results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    if not results.multi_face_landmarks:
        return None

    h, w, _ = image.shape
    face_landmarks = results.multi_face_landmarks[0].landmark

    region_map = {
        "forehead": [10],  # 이마 중앙
        "left_cheek": [234],  # 왼쪽 볼
        "right_cheek": [454],  # 오른쪽 볼
        "lips": [13],  # 입술 중앙
        "left_eye": (33, 133),  # 왼쪽 눈
        "right_eye": (362, 263)  # 오른쪽 눈
    }

    regions = []
    for key, indices in region_map.items():
        if isinstance(indices, tuple):  # 눈 중앙 좌표
            x = int((face_landmarks[indices[0]].x + face_landmarks[indices[1]].x) / 2 * w)
            y = int((face_landmarks[indices[0]].y + face_landmarks[indices[1]].y) / 2 * h)
        else:  # 단일 좌표
            x = int(face_landmarks[indices[0]].x * w)
            y = int(face_landmarks[indices[0]].y * h)

        size = int(min(h, w) * 0.1)
        x_min, x_max = max(0, x - size // 2), min(w, x + size // 2)
        y_min, y_max = max(0, y - size // 2), min(h, y + size // 2)

        region = image[y_min:y_max, x_min:x_max]
        if region.size > 0:
            resized = cv2.resize(region, (64, 64))
            regions.append(resized)

    if len(regions) == len(region_map):
        return np.concatenate(regions, axis=1)
    return None

# 데이터 로드 함수
def load_data(dataset_path, categories):
    data, labels = [], []
    for label, category in enumerate(categories):
        category_path = os.path.join(dataset_path, category)
        for file_name in os.listdir(category_path):
            file_path = os.path.join(category_path, file_name)
            image = cv2.imread(file_path)
            if image is not None:
                cropped_image = crop_face_regions(image)
                if cropped_image is not None:
                    data.append(cropped_image)
                    labels.append(label)
    return np.array(data) / 255.0, to_categorical(np.array(labels), num_classes=len(categories))

# 데이터셋 경로
train_path = r"C:\Users\SSAFY\Desktop\dataset_split\train"
categories = [
    "autumn_dark", "autumn_muted", "autumn_strong",
    "spring_light", "spring_bright", "spring_vivid",
    "summer_light", "summer_muted", "summer_bright",
    "winter_dark", "winter_strong", "winter_vivid"
]

X_train, y_train = load_data(train_path, categories)

# CNN 기반 모델 설계
def build_model(input_shape, num_classes):
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=input_shape)
    base_model.trainable = False  # 사전 학습된 가중치 고정

    model = Sequential([
        base_model,
        GlobalAveragePooling2D(),
        Dense(256, activation='relu'),
        BatchNormalization(),
        Dropout(0.3),
        Dense(128, activation='relu'),
        BatchNormalization(),
        Dropout(0.3),
        Dense(num_classes, activation='softmax')
    ])
    
    model.compile(optimizer=Adam(learning_rate=0.0005), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])
    
    return model

# K-Fold Cross Validation 설정
kf = KFold(n_splits=5, shuffle=True, random_state=42)

# 학습 진행
best_model = None
best_accuracy = 0.0

input_shape = (64, 384, 3)  # 6개 영역을 가로로 결합 (64x64 * 6 = 64x384)

for fold, (train_idx, val_idx) in enumerate(kf.split(X_train)):
    print(f"🔹 Training Fold {fold+1}/5...")

    X_train_fold, X_val_fold = X_train[train_idx], X_train[val_idx]
    y_train_fold, y_val_fold = y_train[train_idx], y_train[val_idx]

    model = build_model(input_shape, len(categories))

    checkpoint = ModelCheckpoint(f"personal_color_classifier_fold{fold+1}.h5", save_best_only=True, monitor='val_accuracy', mode='max')
    early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

    # 학습 예상 시간 출력
    start_time = time.time()
    total_epochs = 50

    for epoch in range(total_epochs):
        epoch_start = time.time()
        
        history = model.fit(X_train_fold, y_train_fold, 
                            validation_data=(X_val_fold, y_val_fold),
                            epochs=1, batch_size=32, verbose=1)

        elapsed_time = time.time() - start_time
        epoch_time = time.time() - epoch_start
        remaining_epochs = total_epochs - (epoch + 1)
        estimated_remaining_time = remaining_epochs * epoch_time

        print(f"🕒 [Epoch {epoch+1}/{total_epochs}] 경과 시간: {elapsed_time:.2f}s | 예상 남은 시간: {estimated_remaining_time:.2f}s")

        if early_stopping.stopped_epoch:
            print("🛑 Early Stopping 적용됨!")
            break

    val_acc = max(history.history['val_accuracy'])
    if val_acc > best_accuracy:
        best_accuracy = val_acc
        best_model = model

print("✅ 모델 학습 완료 및 저장 완료.")
