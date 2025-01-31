from flask import Blueprint, request, jsonify
from tensorflow.keras.models import load_model
from .utils import process_image, predict_top_3
import logging

api = Blueprint('api', __name__)

# 모델 로드
MODEL_PATH = './app/model/personal_color_classifier.h5'
model = load_model(MODEL_PATH)

# 클래스 정의
CATEGORIES = [
    "가을_다크", "가을_뮤트", "가을_스트롱",
    "겨울_다크", "겨울_비비드", "겨울_스트롱",
    "봄_라이트", "봄_브라이트", "봄_비비드",
    "여름_라이트", "여름_뮤트", "여름_브라이트"
]

# 허용된 확장자 목록
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route('/predict', methods=['POST'])
def predict():
    # 요청 검증
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(image_file.filename):
        return jsonify({"error": "File type not allowed. Only PNG, JPG, JPEG are allowed."}), 400

    # 이미지 처리 및 예측
    try:
        image_array = process_image(image_file)  # 파일 객체 직접 전달
        top_3_results = predict_top_3(model, image_array, CATEGORIES)
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        return jsonify({"error": "An error occurred during prediction"}), 500

    # JSON 응답 반환
    response = [{"class_name": class_name, "probability": f"{prob:.2%}"} for class_name, prob in top_3_results]
    return jsonify(response), 200
