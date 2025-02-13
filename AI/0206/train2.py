import os
import cv2
import mediapipe as mp
import numpy as np
import time
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, Callback, ReduceLROnPlateau
from tensorflow.keras.utils import to_categorical
import tensorflow as tf

# GPU 설정 (최신 API 사용)
os.environ['CUDA_VISIBLE_DEVICES'] = '5'
print("TensorFlow 버전:", tf.__version__)
print("사용 가능한 GPU:", tf.config.list_physical_devices('GPU'))

gpus = tf.config.list_physical_devices('GPU')
if gpus:
    try:
        tf.config.set_logical_device_configuration(
            gpus[0],
            [tf.config.LogicalDeviceConfiguration(memory_limit=16000)]
        )
        print("✅ GPU 메모리 제한 적용됨 (16GB)")
    except RuntimeError as e:
        print(e)

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
        "forehead": [10],         # 이마 중앙
        "left_cheek": [234],       # 왼쪽 볼
        "right_cheek": [454],      # 오른쪽 볼
        "lips": [13],              # 입술 중앙
        "left_eye": (33, 133),     # 왼쪽 눈
        "right_eye": (362, 263)    # 오른쪽 눈
    }

    regions = []
    for key, indices in region_map.items():
        if isinstance(indices, tuple):  # 두 점의 중간 좌표 (눈)
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
        return np.concatenate(regions, axis=1)  # 좌우로 결합 (6영역 → 64x384)
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
    data = np.array(data, dtype=np.float32) / 255.0
    labels = to_categorical(np.array(labels), num_classes=len(categories))
    return data, labels

# 학습 시간과 남은 시간 추적을 위한 콜백 클래스
class TimeHistory(Callback):
    def on_train_begin(self, logs=None):
        self.train_start = time.time()
    
    def on_epoch_begin(self, epoch, logs=None):
        self.epoch_start = time.time()
    
    def on_epoch_end(self, epoch, logs=None):
        epoch_time = time.time() - self.epoch_start
        elapsed_time = time.time() - self.train_start
        remaining_epochs = self.params['epochs'] - (epoch + 1)
        estimated_remaining_time = remaining_epochs * epoch_time
        print(f"🕒 [Epoch {epoch+1}/{self.params['epochs']}] 경과 시간: {elapsed_time:.2f}s | 예상 남은 시간: {estimated_remaining_time:.2f}s")

# 데이터 증강 코드 제거된 모델 생성 함수
def build_model(input_shape, num_classes):
    model = Sequential()
    # MobileNetV2 기반 모델 (사전 학습 가중치 고정)
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=input_shape)
    base_model.trainable = False
    model.add(base_model)
    model.add(GlobalAveragePooling2D())
    model.add(Dense(256, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(0.3))
    model.add(Dense(128, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(0.3))
    model.add(Dense(num_classes, activation='softmax'))
    
    model.compile(optimizer=Adam(learning_rate=0.0005), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])
    return model

def main():
    # 데이터셋 경로 및 카테고리
    train_path = "/home/j-i12d106/dataset/dataset_split/train"
    categories = [
        "autumn_dark", "autumn_muted", "autumn_strong",
        "spring_light", "spring_bright", "spring_vivid",
        "summer_light", "summer_muted", "summer_bright",
        "winter_dark", "winter_strong", "winter_vivid"
    ]
    
    print("데이터 로드 중...")
    X_train, y_train = load_data(train_path, categories)
    print(f"데이터 로드 완료: {X_train.shape}, {y_train.shape}")

    # 입력 이미지 크기: 6개 영역을 좌우로 결합 → (64, 384, 3)
    input_shape = (64, 384, 3)
    
    # Phase 1: MobileNetV2 가중치는 고정하고 새 분류기 층만 학습
    print("Phase 1: 상위 분류기 층 학습 시작 (기본 학습)...")
    model = build_model(input_shape, len(categories))
    model.summary()

    # 모델 저장 경로 설정
    save_dir = "/home/j-i12d106/saved_models"
    os.makedirs(save_dir, exist_ok=True)
    checkpoint_path_phase1 = os.path.join(save_dir, "personal_color_classifier_phase1.h5")

    # 콜백 설정
    checkpoint_phase1 = ModelCheckpoint(checkpoint_path_phase1, save_best_only=True, monitor='val_accuracy', mode='max', verbose=1)
    early_stopping_phase1 = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True, verbose=1)
    reduce_lr_phase1 = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)
    time_callback = TimeHistory()

    total_epochs_phase1 = 50

    history = model.fit(
        X_train, y_train,
        validation_split=0.2,
        epochs=total_epochs_phase1,
        batch_size=32,
        callbacks=[checkpoint_phase1, early_stopping_phase1, reduce_lr_phase1, time_callback],
        verbose=1
    )

    # Phase 1 학습 완료된 모델 로드
    model.load_weights(checkpoint_path_phase1)
    print("Phase 1 완료. 이제 Fine-Tuning 진행...")

    # MobileNetV2의 상위 일부 레이어(예: 마지막 20개)를 풀어서 재학습
    for layer in model.layers:
        if "mobilenetv2" in layer.name:
            base_model = layer
            break
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    for layer in base_model.layers[-20:]:
        layer.trainable = True

    # Fine-Tuning을 위한 낮은 학습률 적용
    model.compile(optimizer=Adam(learning_rate=1e-5), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])

    checkpoint_path_phase2 = os.path.join(save_dir, "personal_color_classifier_phase2.h5")
    checkpoint_phase2 = ModelCheckpoint(checkpoint_path_phase2, save_best_only=True, monitor='val_accuracy', mode='max', verbose=1)
    early_stopping_phase2 = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True, verbose=1)
    reduce_lr_phase2 = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)

    total_epochs_phase2 = 30
    history_ft = model.fit(
        X_train, y_train,
        validation_split=0.2,
        epochs=total_epochs_phase2,
        batch_size=32,
        callbacks=[checkpoint_phase2, early_stopping_phase2, reduce_lr_phase2, time_callback],
        verbose=1
    )

    # Fine-Tuning 완료 후 모델 저장
    model.save(checkpoint_path_phase2)
    print(f"✅ 모델 Fine-Tuning 완료 및 저장 완료: {checkpoint_path_phase2}")
    print(f"📁 저장된 모델 확인: {os.listdir(save_dir)}")

if __name__ == '__main__':
    main()
