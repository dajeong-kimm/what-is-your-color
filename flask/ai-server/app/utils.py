import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from PIL import Image
import io

def process_image(image_file):
    image = Image.open(image_file)  # 파일 객체로부터 이미지 열기

    # RGBA 이미지를 RGB로 변환
    if image.mode == "RGBA":
        image = image.convert("RGB")

    image = image.resize((224, 224))  # 크기 조정
    image_array = img_to_array(image)
    image_array = np.expand_dims(image_array, axis=0)  # 배치 차원 추가
    image_array = image_array / 255.0  # 정규화
    return image_array


# def process_image(image_file):
#     """
#     업로드된 파일 객체를 처리하여 모델 입력 형식으로 변환합니다.
#     """
#     image = Image.open(image_file)  # 파일 객체로부터 이미지 열기
#     image = image.resize((224, 224))  # 크기 조정
#     image_array = img_to_array(image)
#     image_array = np.expand_dims(image_array, axis=0)  # 배치 차원 추가
#     image_array = image_array / 255.0  # 정규화
#     return image_array

def predict_top_3(model, image_array, categories):
    """
    모델이 예측한 상위 3개의 클래스와 확률을 반환합니다.
    """
    predictions = model.predict(image_array)
    predictions = predictions[0]  # 배치 차원 제거

    top_indices = predictions.argsort()[-3:][::-1]  # 확률 높은 순으로 정렬
    top_3 = [(categories[i], predictions[i]) for i in top_indices]
    return top_3
