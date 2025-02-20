import os
import cv2
import mediapipe as mp
import numpy as np
import time
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.utils import to_categorical
import tensorflow as tf

# GPU 설정
os.environ['CUDA_VISIBLE_DEVICES'] = '5'

print(tf.__version__)
print(tf.config.list_physical_devices('GPU'))

gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        tf.config.experimental.set_virtual_device_configuration(
            gpus[0], [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=16000)]
        )  # 16GB 메모리 제한 설정
        print("✅ GPU 메모리 제한 적용됨 (16GB)")
    except RuntimeError as e:
        print(e)

# Mediapipe Face Mesh 설정
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, min_detection_confidence=0.5)

# 얼굴 특정 영역 크롭 함수 (변경 없음)
def crop_face_regions(image):
    results = face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    if not results.multi_face_landmarks:
        return None

    h, w, _ = image.shape
    face_landmarks = results.multi_face_landmarks[0].landmark

    region_map = {
        "forehead": [10],       # 이마 중앙
        "left_cheek": [234],     # 왼쪽 볼
        "right_cheek": [454],    # 오른쪽 볼
        "lips": [13],            # 입술 중앙
        "left_eye": (33, 133),   # 왼쪽 눈
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

# 데이터 로드 함수 (변경 없음)
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

# 데이터셋 경로 및 카테고리 설정
train_path = "/home/j-i12d106/dataset/dataset_split/train"
categories = [
    "autumn_dark", "autumn_muted", "autumn_strong",
    "spring_light", "spring_bright", "spring_vivid",
    "summer_light", "summer_muted", "summer_bright",
    "winter_dark", "winter_strong", "winter_vivid"
]

X_train, y_train = load_data(train_path, categories)

# 데이터 증강 레이어 제거하고 CNN 기반 모델 설계 (데이터 증강 없이)
def build_model(input_shape, num_classes):
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=input_shape)
    base_model.trainable = False  # 초기에는 사전 학습된 가중치를 고정

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

# 입력 이미지 크기 (6개 영역을 가로로 결합: 64 x 64 * 6 = 64 x 384)
input_shape = (64, 384, 3)
model = build_model(input_shape, len(categories))
model.summary()

# 저장 디렉토리 생성
save_dir = "/home/j-i12d106/saved_models"
os.makedirs(save_dir, exist_ok=True)
checkpoint_path = os.path.join(save_dir, "personal_color_classifier.h5")

# 콜백 설정: 체크포인트, 얼리 스탑, 그리고 학습률 감소
checkpoint = ModelCheckpoint(checkpoint_path, save_best_only=True, monitor='val_accuracy', mode='max', verbose=1)
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True, verbose=1)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)

# 초기 학습: MobileNetV2의 가중치는 고정된 상태로 학습
initial_epochs = 20
history = model.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=initial_epochs,
    batch_size=32,
    callbacks=[checkpoint, early_stopping, reduce_lr],
    verbose=1
)

# Fine-tuning: base_model의 일부를 해제하여 미세 조정
# base_model은 model.layers[0]에 위치함
base_model = model.layers[0]
base_model.trainable = True

# 예를 들어, MobileNetV2의 마지막 50개 레이어만 학습하도록 설정
fine_tune_at = len(base_model.layers) - 50
for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False

# 재컴파일 (더 낮은 학습률 적용)
model.compile(optimizer=Adam(learning_rate=1e-5),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

fine_tune_epochs = 10
total_epochs = initial_epochs + fine_tune_epochs

history_fine = model.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=total_epochs,
    initial_epoch=history.epoch[-1] + 1,
    batch_size=32,
    callbacks=[checkpoint, early_stopping, reduce_lr],
    verbose=1
)

# 학습 완료 후 모델 저장
model.save(checkpoint_path)
print(f"✅ 모델 학습 완료 및 저장 완료: {checkpoint_path}")
print(f"📁 저장된 모델 확인: {os.listdir(save_dir)}")
