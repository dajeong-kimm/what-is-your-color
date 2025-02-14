import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import to_categorical
from sklearn.metrics import accuracy_score
import mediapipe as mp

# ✅ Mediapipe Face Mesh 설정 (메모리 누수 방지)
mp_face_mesh = mp.solutions.face_mesh

# ✅ 얼굴 특정 영역 크롭 함수
def crop_face_regions(image):
    with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, min_detection_confidence=0.5) as face_mesh:
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

# ✅ 데이터 로드 함수
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

    if len(data) == 0 or len(labels) == 0:
        print("❌ 데이터가 로드되지 않았습니다. 경로를 확인하세요.")
        exit()

    return np.array(data) / 255.0, to_categorical(np.array(labels), num_classes=len(categories))

# ✅ 테스트 데이터 로드
test_path = "/home/j-i12d106/dataset/dataset_split/test"

categories = [
    "autumn_dark", "autumn_muted", "autumn_strong",
    "spring_light", "spring_bright", "spring_vivid",
    "summer_light", "summer_muted", "summer_bright",
    "winter_dark", "winter_strong", "winter_vivid"
]

X_test, y_test = load_data(test_path, categories)

# ✅ 저장된 모델 불러오기 (경로 수정)
model_path = "/home/j-i12d106/saved_models/personal_color_classifier.h5"  # 올바른 경로로 변경
if not os.path.exists(model_path):
    print(f"❌ 모델 파일이 존재하지 않습니다: {model_path}")
    exit()

print(f"🔄 모델 로드 중... {model_path}")
model = load_model(model_path)

# ✅ 모델 평가 (배치 사이즈 명시)
print("🔍 테스트 데이터로 정확도 평가 중...")
y_pred = model.predict(X_test, batch_size=32, verbose=1)
y_pred_labels = np.argmax(y_pred, axis=1)
y_test_labels = np.argmax(y_test, axis=1)

# ✅ 정확도 출력
test_accuracy = accuracy_score(y_test_labels, y_pred_labels)
print(f"✅ 테스트 데이터 정확도: {test_accuracy:.4f}")
