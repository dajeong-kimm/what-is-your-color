from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
import tensorflow as tf

# 사용 가능한 GPU 확인
gpus = tf.config.list_physical_devices('GPU')
if gpus:
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
    train_dir = f"{data_dir}/train"
    val_dir = f"{data_dir}/validation"

    # 데이터 증강 및 전처리
    train_datagen = ImageDataGenerator(rescale=1.0 / 255.0)
    val_datagen = ImageDataGenerator(rescale=1.0 / 255.0)

    train_data = train_datagen.flow_from_directory(
        train_dir, target_size=(224, 224), batch_size=32, class_mode="categorical"
    )

    val_data = val_datagen.flow_from_directory(
        val_dir, target_size=(224, 224), batch_size=32, class_mode="categorical"
    )

    # 모델 정의
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))

    model = Sequential([
        base_model,
        GlobalAveragePooling2D(),
        Dense(128, activation="relu"),
        Dense(len(categories), activation="softmax")
    ])

    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

    # 모델 학습
    model.fit(train_data, validation_data=val_data, epochs=epochs)
    model.save(model_save_path)
    print(f"모델이 {model_save_path}에 저장되었습니다.")

if __name__ == "__main__":
    data_directory = "C:/Users/SSAFY/Desktop/split_data"
    save_path = "C:/Users/SSAFY/Desktop/personal_color_classifier.h5"
    categories = [
        "가을_다크", "가을_뮤트", "가을_스트롱",
        "겨울_다크", "겨울_비비드", "겨울_스트롱",
        "봄_라이트", "봄_브라이트", "봄_비비드",
        "여름_라이트", "여름_뮤트", "여름_브라이트"
    ]
    train_model(data_directory, save_path, categories)
