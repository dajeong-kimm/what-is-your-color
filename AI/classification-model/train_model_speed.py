from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.mixed_precision import set_global_policy
import tensorflow as tf
import os

# Mixed Precision 설정
set_global_policy('mixed_float16')

# GPU 설정
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
    print(f"GPU가 사용 가능합니다: {gpus}")
else:
    print("GPU를 사용할 수 없습니다. CPU로 실행됩니다.")

def train_model(data_dir, model_save_path, categories, epochs=5):
    """
    MobileNetV2 모델을 학습하고 저장합니다.

    Args:
        data_dir (str): 데이터 디렉토리 (train, validation 포함).
        model_save_path (str): 학습된 모델 저장 경로.
        categories (list): 클래스 이름 리스트.
        epochs (int): 학습 에포크 수.
    """
    # 데이터 디렉토리 경로를 확인하고 Unicode 인코딩 문제 방지
    train_dir = os.path.join(data_dir, "train")
    val_dir = os.path.join(data_dir, "validation")

    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        raise FileNotFoundError("train 또는 validation 디렉토리가 존재하지 않습니다. 경로를 확인하세요.")

    # 데이터셋 생성 (tf.keras.utils.image_dataset_from_directory 사용)
    train_data = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=(224, 224),
        batch_size=64,
        label_mode="categorical"
    )

    val_data = tf.keras.utils.image_dataset_from_directory(
        val_dir,
        image_size=(224, 224),
        batch_size=64,
        label_mode="categorical"
    )

    # Prefetch를 사용해 데이터 로딩 최적화
    train_data = train_data.prefetch(buffer_size=tf.data.AUTOTUNE)
    val_data = val_data.prefetch(buffer_size=tf.data.AUTOTUNE)

    # 모델 정의
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False  # 사전 학습된 가중치 고정

    model = Sequential([
        base_model,
        GlobalAveragePooling2D(),
        Dropout(0.3),  # 과적합 방지
        Dense(128, activation="relu"),
        Dense(len(categories), activation="softmax", dtype="float32")  # FP16 사용 시 softmax를 FP32로 유지
    ])

    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

    # 모델 학습
    model.fit(train_data, validation_data=val_data, epochs=epochs)
    model.save(model_save_path)
    print(f"모델이 {model_save_path}에 저장되었습니다.")

if __name__ == "__main__":
    # 경로에 특수 문자가 없는지 확인
    data_directory = r"C:\Users\SSAFY\Desktop\split_data"  # 경로 앞에 r을 추가하여 raw string으로 처리
    save_path = r"C:\Users\SSAFY\Desktop\personal_color_classifier.h5"
    categories = [
        "가을_다크", "가을_뮤트", "가을_스트롱",
        "겨울_다크", "겨울_비비드", "겨울_스트롱",
        "봄_라이트", "봄_브라이트", "봄_비비드",
        "여름_라이트", "여름_뮤트", "여름_브라이트"
    ]
    train_model(data_directory, save_path, categories)
