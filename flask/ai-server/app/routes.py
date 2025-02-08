from flask import Blueprint, request, jsonify
import logging
import cv2
import traceback
import numpy as np
from tensorflow.keras.models import load_model
from .utils import (
    process_image, predict_top_3,
    rgb_to_lab, delta_e, extract_face_colors,
    find_personal_color_using_skin_avg, color_correction_lab, to_hex
)

###########################################
# 퍼스널컬러 DB – 화장품 추천 색상 정보 (Lip, Cheek, Eye)
###########################################
lip_colors_db = {
    1: ["#E5A59F", "#C99085", "#BE8790", "#C08288", "#C07073"],
    2: ["#C44654", "#C14C3E", "#B3353A", "#B63C4B", "#BF3A4D"],
    3: ["#D47272", "#CD6963", "#CB4849", "#C9474C", "#C92031"],
    4: ["#C37899", "#C4688E", "#C2516E", "#B53C62", "#B64F8C"],
    5: ["#C07C9D", "#B95276", "#AD3E71", "#A4355B", "#AF3451"],
    6: ["#B5708E", "#AD5F80", "#A65A76", "#9A516F", "#984A66"],
    7: ["#C47666", "#BD726A", "#AA5856", "#9D4D4D", "#C0665E"],
    8: ["#BB3B45", "#A74345", "#B13A4C", "#AD4749", "#8E394C"],
    9: ["#98484A", "#7C3246", "#7D425C", "#733A4B", "#6C3344"],
    10: ["#CD387B", "#BD2E79", "#B43350", "#952B4F", "#9F3242"],
    11: ["#C03163", "#BD3480", "#AE3A60", "#A4324A", "#93355B"],
    12: ["#954D65", "#A74660", "#883756", "#7F395F", "#833A54"]
}

cheek_colors_db = {
    1: ["#FEE8DC", "#ECC5C3", "#DAAEA4", "#D3A3A4", "#D39391"],
    2: ["#E6BD98", "#D49186", "#CC817B", "#C96B64", "#CC665F"],
    3: ["#F6E6DB", "#E7B6AD", "#E2A989", "#D57770", "#D76768"],
    4: ["#EAE0E1", "#DFC9C9", "#CFAEB7", "#C59FB5", "#C2AFC4"],
    5: ["#EACFCB", "#DCB7BC", "#D4A9B8", "#C4AEC1", "#C07FA1"],
    6: ["#D7BDC8", "#D1AFBA", "#BD95A8", "#B18190", "#A8788B"],
    7: ["#ECC4A9", "#E0B199", "#CBA087", "#C69587", "#C08980"],
    8: ["#E19D8A", "#CF7F75", "#C55858", "#C4605C", "#C96B67"],
    9: ["#DE9E92", "#CE9C92", "#BF8984", "#BA7C7F", "#C78480"],
    10: ["#F4F4F4", "#F1D8E7", "#E1CAE1", "#CBA5CD", "#C583B6"],
    11: ["#CA87AD", "#C485B0", "#B05E91", "#9A467F", "#A94C65"],
    12: ["#DAAEB6", "#CC9FA8", "#AC87A1", "#B37484", "#9D6485"]
}

eye_palette_db = {
    1: ["#F4E0D5", "#E9CEC5", "#E0BAA9", "#DAAAAB", "#B28F88"],
    2: ["#EFD7C4", "#DDB3A0", "#CB8082", "#C97264", "#794D50"],
    3: ["#F4CFC3", "#E6B19A", "#D3716C", "#B56D61", "#804F4E"],
    4: ["#DACED3", "#DAC4C6", "#C7A1B4", "#A6788A", "#886877"],
    5: ["#EBDDDA", "#ECD7DA", "#B67792", "#A37088", "#635256"],
    6: ["#E0CDCC", "#D0C0C6", "#B39398", "#987D80", "#876973"],
    7: ["#F8DFCA", "#DCBA9D", "#C79883", "#BC8A72", "#A27866"],
    8: ["#EBB68E", "#D7A584", "#BB7260", "#966358", "#6B4C47"],
    9: ["#E1B393", "#D4A48A", "#A78A7D", "#6C5A5A", "#584D4E"],
    10: ["#F3F3F4", "#ECE5EF", "#DCB6CD", "#B86393", "#433C4A"],
    11: ["#E1CBC9", "#CBA4B2", "#9F7187", "#76385E", "#433948"],
    12: ["#DDC6BF", "#CDB5B6", "#A5868B", "#847279", "#52465A"]
}

# 출력용 personal_color_names (퍼스널 컬러 진단용)
personal_color_names = {
    1: "봄 웜 라이트",
    2: "봄 웜 비비드",
    3: "봄 웜 브라이트",
    4: "여름 쿨 라이트",
    5: "여름 쿨 브라이트",
    6: "여름 쿨 뮤트",
    7: "가을 웜 뮤트",
    8: "가을 웜 스트롱",
    9: "가을 웜 다크",
    10: "겨울 쿨 비비드",
    11: "겨울 쿨 스트롱",
    12: "겨울 쿨 다크"
}

api = Blueprint('api', __name__)

# ─────────────────────────────────────────────
# 모델 로드 (새 모델 경로로 수정)
# ─────────────────────────────────────────────
MODEL_PATH = './app/model/new_model.h5'
model = load_model(MODEL_PATH)

# ─────────────────────────────────────────────
# 새 모델에 맞는 클래스 목록 (영어 라벨)
# ─────────────────────────────────────────────
CATEGORIES = [
    "autumn_dark", "autumn_muted", "autumn_strong",
    "spring_light", "spring_bright", "spring_vivid",
    "summer_light", "summer_muted", "summer_bright",
    "winter_dark", "winter_strong", "winter_vivid"
]

# ─────────────────────────────────────────────
# 영어 -> 한국어 라벨 매핑 (예측 응답시 사용)
# ─────────────────────────────────────────────
english_to_korean = {
    "autumn_dark": "가을_다크",
    "autumn_muted": "가을_뮤트",
    "autumn_strong": "가을_스트롱",
    "spring_light": "봄_라이트",
    "spring_bright": "봄_브라이트",
    "spring_vivid": "봄_비비드",
    "summer_light": "여름_라이트",
    "summer_muted": "여름_뮤트",
    "summer_bright": "여름_브라이트",
    "winter_dark": "겨울_다크",
    "winter_strong": "겨울_스트롱",
    "winter_vivid": "겨울_비비드"
}

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route('/predict/model', methods=['POST'])
def predict():
    # 요청 검증
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(image_file.filename):
        return jsonify({"error": "File type not allowed. Only PNG, JPG, JPEG are allowed."}), 400

    try:
        # 새 전처리 함수(process_image)를 이용하여 얼굴 영역 추출 후 모델 입력 생성
        image_array = process_image(image_file)
        top_3_results = predict_top_3(model, image_array, CATEGORIES)
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        return jsonify({"error": "An error occurred during prediction"}), 500

    # 예측 결과를 영어 라벨에서 한국어 라벨로 변환하여 JSON 응답 생성
    response = [{
        "class_name": english_to_korean.get(class_name, class_name),
        "probability": f"{prob:.2%}"
    } for class_name, prob in top_3_results]
    return jsonify(response), 200

@api.route('/predict/colordist', methods=['POST'])
def predict_color_distribution():
    try:
        if 'face_image' not in request.files:
            return jsonify({"error": "The 'face_image' file is required"}), 400

        face_image = request.files['face_image']
        a4_image = request.files.get('a4_image', None)  # A4 이미지 (선택적)

        face_image = cv2.imdecode(np.frombuffer(face_image.read(), np.uint8), cv2.IMREAD_COLOR)
        if face_image is None:
            return jsonify({"error": "Invalid 'face_image' file"}), 400

        # BGR -> RGB 변환
        face_rgb = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)

        if a4_image:
            a4_image = cv2.imdecode(np.frombuffer(a4_image.read(), np.uint8), cv2.IMREAD_COLOR)
            if a4_image is None:
                return jsonify({"error": "Invalid 'a4_image' file"}), 400

            a4_rgb = cv2.cvtColor(a4_image, cv2.COLOR_BGR2RGB)
            # A4 이미지 중앙의 화이트 레퍼런스 추출
            a4_x, a4_y = a4_rgb.shape[1] // 2, a4_rgb.shape[0] // 2
            white_ref = a4_rgb[a4_y, a4_x]
            # 화이트 레퍼런스를 기반으로 색상 보정
            corrected_face = color_correction_lab(face_rgb, white_ref)

            # 보정된 이미지에서 Mediapipe로 얼굴 색상 추출
            extracted_corr = extract_face_colors(corrected_face)
            if extracted_corr is None:
                return jsonify({"error": "Failed to extract landmarks from corrected image"}), 400

            skin_avg_corr, _, eye_color_corr, hair_color_corr = extracted_corr

            ranking_corr = find_personal_color_using_skin_avg(
                skin_avg_corr, eye_color_corr, hair_color_corr,
                lip_colors_db, cheek_colors_db, eye_palette_db
            )
        else:
            corrected_face = None
            ranking_corr = None

        # 원본 이미지에서 얼굴 색상 추출
        extracted_orig = extract_face_colors(face_rgb)
        if extracted_orig is None:
            return jsonify({"error": "Failed to extract landmarks from original image"}), 400

        skin_avg_orig, _, eye_color_orig, hair_color_orig = extracted_orig

        ranking_orig = find_personal_color_using_skin_avg(
            skin_avg_orig, eye_color_orig, hair_color_orig,
            lip_colors_db, cheek_colors_db, eye_palette_db
        )

        response = {
            "original_image": {
                "skin_avg": to_hex(skin_avg_orig),
                "eye_color": to_hex(eye_color_orig),
                "hair_color": to_hex(hair_color_orig),
                "diagnosis": [
                    {"rank": rank, "personal_color": personal_color_names[p_id], "total_delta_e": f"{score:.2f}"}
                    for rank, (p_id, score) in enumerate(ranking_orig, start=1)
                ]
            }
        }

        if ranking_corr:
            response["corrected_image"] = {
                "skin_avg": to_hex(skin_avg_corr),
                "eye_color": to_hex(eye_color_corr),
                "hair_color": to_hex(hair_color_corr),
                "diagnosis": [
                    {"rank": rank, "personal_color": personal_color_names[p_id], "total_delta_e": f"{score:.2f}"}
                    for rank, (p_id, score) in enumerate(ranking_corr, start=1)
                ]
            }

        return jsonify(response), 200

    except Exception as e:
        logging.error(f"Unexpected error: {traceback.format_exc()}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
