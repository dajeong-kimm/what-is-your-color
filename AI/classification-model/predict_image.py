import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

def predict_image(model_path, img_path, categories):
    """
    이미지를 예측합니다.

    Args:
        model_path (str): 학습된 모델 경로.
        img_path (str): 예측할 이미지 경로.
        categories (list): 클래스 이름 리스트.
    """
    model = tf.keras.models.load_model(model_path)

    img = image.load_img(img_path, target_size=(224, 224))
    img_array = np.expand_dims(image.img_to_array(img) / 255.0, axis=0)

    predictions = model.predict(img_array)
    predicted_class = categories[np.argmax(predictions)]
    print(f"Predicted class: {predicted_class}")

if __name__ == "__main__":
    model_path = "C:/Users/SSAFY/Desktop/personal_color_classifier.h5"
    img_path = "C:/Users/SSAFY/Desktop/퍼스널컬러/test_image.jpg"
    categories = [
        "가을_다크", "가을_뮤트", "가을_스트롱",
        "겨울_다크", "겨울_비비드", "겨울_스트롱",
        "봄_라이트", "봄_브라이트", "봄_비비드",
        "여름_라이트", "여름_뮤트", "여름_브라이트"
    ]
    predict_image(model_path, img_path, categories)
