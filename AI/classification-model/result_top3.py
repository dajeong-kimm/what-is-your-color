import numpy as np

categories = [
    "가을_다크", "가을_뮤트", "가을_스트롱",
    "겨울_다크", "겨울_비비드", "겨울_스트롱",
    "봄_라이트", "봄_브라이트", "봄_비비드",
    "여름_라이트", "여름_뮤트", "여름_브라이트"
]


def predict_top_3(model, image_path, categories):
    """
    이미지에 대해 모델이 예측한 상위 3개의 클래스와 확률을 반환합니다.

    Args:
        model (tf.keras.Model): 학습된 모델.
        image_path (str): 입력 이미지 파일 경로.
        categories (list): 클래스 이름 리스트.

    Returns:
        list: [(class_name, probability), ...] 형식의 상위 3개 결과 리스트.
    """
    from tensorflow.keras.preprocessing.image import load_img, img_to_array

    # 이미지 로드 및 전처리
    image = load_img(image_path, target_size=(224, 224))
    image_array = img_to_array(image)
    image_array = np.expand_dims(image_array, axis=0)  # 배치 차원 추가
    image_array = image_array / 255.0  # 스케일 조정

    # 예측
    predictions = model.predict(image_array)
    predictions = predictions[0]  # 배치 차원 제거

    # 상위 3개 결과 추출
    top_indices = predictions.argsort()[-3:][::-1]  # 확률 높은 순으로 정렬
    top_3 = [(categories[i], predictions[i]) for i in top_indices]

    return top_3


from tensorflow.keras.models import load_model

model = load_model("C:/Users/SSAFY/Desktop/personal_color_classifier.h5")

test_image_path = "C:/Users/SSAFY/Desktop/test_image.png"

top_3_results = predict_top_3(model, test_image_path, categories)

print("Top 3 Predictions:")
for class_name, prob in top_3_results:
    print(f"{class_name}: {prob:.2%}")
