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
import os

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

# ─────────────────────────────────────────────
# [추가] a4_image 저장 API
# ─────────────────────────────────────────────
@api.route('/predict/store/a4', methods=['POST'])
def store_a4():
    if 'a4_image' not in request.files:
        return jsonify({"error": "No a4_image file provided"}), 400

    a4_file = request.files['a4_image']
    if a4_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(a4_file.filename):
        return jsonify({"error": "File type not allowed. Only PNG, JPG, JPEG are allowed."}), 400

    try:
        # 저장할 디렉토리 (예: app/static) 생성
        save_dir = os.path.join(os.getcwd(), "app", "static")
        os.makedirs(save_dir, exist_ok=True)
        file_path = os.path.join(save_dir, "a4_image.jpg")
        a4_file.save(file_path)
        return jsonify({"message": "A4 image saved successfully", "file_path": file_path}), 200
    except Exception as e:
        logging.error(f"Failed to store a4 image: {str(e)}")
        return jsonify({"error": "Failed to store a4 image"}), 500

# ─────────────────────────────────────────────
# /predict/model API (기존)
# ─────────────────────────────────────────────
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

# ─────────────────────────────────────────────
# /predict/colordist API (수정됨)
# ─────────────────────────────────────────────
@api.route('/predict/colordist', methods=['POST'])
def predict_color_distribution():
    try:
        if 'face_image' not in request.files:
            return jsonify({"error": "The 'face_image' file is required"}), 400

        face_image_file = request.files['face_image']
        face_image = cv2.imdecode(np.frombuffer(face_image_file.read(), np.uint8), cv2.IMREAD_COLOR)
        if face_image is None:
            return jsonify({"error": "Invalid 'face_image' file"}), 400

        # BGR -> RGB 변환
        face_rgb = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)

        # a4_image: 요청으로 전송되었는지 확인하고, 없으면 저장된 파일 사용
        a4_image_file = request.files.get('a4_image', None)
        a4_rgb = None

        if a4_image_file:
            a4_image = cv2.imdecode(np.frombuffer(a4_image_file.read(), np.uint8), cv2.IMREAD_COLOR)
            if a4_image is None:
                return jsonify({"error": "Invalid 'a4_image' file"}), 400
            a4_rgb = cv2.cvtColor(a4_image, cv2.COLOR_BGR2RGB)
        else:
            # 저장된 a4_image 파일 경로
            stored_a4_path = os.path.join(os.getcwd(), "app", "static", "a4_image.jpg")
            if os.path.exists(stored_a4_path):
                stored_a4 = cv2.imread(stored_a4_path, cv2.IMREAD_COLOR)
                if stored_a4 is not None:
                    a4_rgb = cv2.cvtColor(stored_a4, cv2.COLOR_BGR2RGB)

        if a4_rgb is not None:
            # A4 이미지 중앙의 화이트 레퍼런스 추출
            a4_x, a4_y = a4_rgb.shape[1] // 2, a4_rgb.shape[0] // 2
            white_ref = a4_rgb[a4_y, a4_x]
            # 화이트 레퍼런스를 기반으로 색상 보정
            corrected_face = color_correction_lab(face_rgb, white_ref)

            # 보정된 이미지에서 Mediapipe로 얼굴 색상 추출
            extracted_corr = extract_face_colors(corrected_face)
            if extracted_corr is None:
                return jsonify({"error": "Failed to extract landmarks from corrected image"}), 400

            skin_avg_corr, skin_bright_corr , eye_color_corr, hair_color_corr = extracted_corr

            ranking_corr = find_personal_color_using_skin_avg(
                skin_avg_corr, skin_bright_corr, eye_color_corr, hair_color_corr,
                lip_colors_db, cheek_colors_db, eye_palette_db
            )
        else:
            corrected_face = None
            ranking_corr = None

        # 원본 이미지에서 얼굴 색상 추출
        extracted_orig = extract_face_colors(face_rgb)
        if extracted_orig is None:
            return jsonify({"error": "Failed to extract landmarks from original image"}), 400

        skin_avg_orig, skin_bright_orig, eye_color_orig, hair_color_orig = extracted_orig

        ranking_orig = find_personal_color_using_skin_avg(
            skin_avg_orig, skin_avg_orig, eye_color_orig, hair_color_orig,
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

        # 콘솔에 원본 이미지 상위 3 순위 출력
        print("Original image top 3 ranking:")
        for rank, (p_id, score) in enumerate(ranking_orig[:3], start=1):
            print(f"Rank {rank}: {personal_color_names[p_id]} - Total DeltaE: {score:.2f}")
        return jsonify(response), 200

    except Exception as e:
        logging.error(f"Unexpected error: {traceback.format_exc()}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

def extract_lip_color(image):
    """
    GrabCut을 이용해 이미지에서 중앙 영역(가정: 립스틱 영역)이 포함된 부분을 분리한 후,
    해당 영역의 평균 색상을 계산하여 RGB 순서의 numpy array로 반환합니다.
    image: OpenCV BGR 이미지
    """
    h, w = image.shape[:2]
    # 중앙 영역을 대략 포함하는 사각형 (튜닝 가능)
    rect = (w // 4, h // 4, w // 2, h // 2)
    mask = np.zeros(image.shape[:2], np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)

    # GrabCut 알고리즘 실행 (반복 횟수 5)
    cv2.grabCut(image, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    # mask 값 0,2는 배경, 1,3은 전경으로 간주
    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

    if np.count_nonzero(mask2) > 0:
        # 전경 영역(립스틱 영역)만 대상으로 평균 색상 계산 (BGR 순서)
        avg_color_bgr = cv2.mean(image, mask=mask2)[0:3]
        # BGR -> RGB 변환
        avg_color_rgb = (avg_color_bgr[2], avg_color_bgr[1], avg_color_bgr[0])
        return np.array(avg_color_rgb, dtype=np.int32)
    else:
        # 만약 분리 실패 시 전체 이미지 평균 색상 사용 (BGR -> RGB)
        avg_color_bgr = np.mean(image, axis=(0, 1))
        avg_color_rgb = (avg_color_bgr[2], avg_color_bgr[1], avg_color_bgr[0])
        return np.array(avg_color_rgb, dtype=np.int32)


@api.route('/predict/lip', methods=['POST'])
def predict_lip():
    # 립스틱 이미지 검증
    if 'lip_image' not in request.files:
        return jsonify({"error": "No lip_image file provided"}), 400

    lip_file = request.files['lip_image']
    if lip_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(lip_file.filename):
        return jsonify({"error": "File type not allowed. Only PNG, JPG, JPEG are allowed."}), 400

    try:
        # 파일 디코딩 및 이미지 읽기 (cv2는 기본 BGR)
        file_bytes = np.frombuffer(lip_file.read(), np.uint8)
        lip_image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if lip_image is None:
            return jsonify({"error": "Invalid lip_image file"}), 400

        # GrabCut을 이용해 배경 제외 후 립스틱 영역의 평균 색상 추출 (RGB 순서)
        lip_avg = extract_lip_color(lip_image)

        # 평균 색상을 hex 문자열로 변환
        lip_hex = to_hex(lip_avg)
        # hex 색상을 LAB 색상으로 변환 (비교를 위해)
        lip_lab = rgb_to_lab(lip_hex)

        # 각 퍼스널 컬러 후보(p=1~12)에 대해 lip_colors_db의 색상들과의 평균 Delta E 계산
        scores = []
        for p in lip_colors_db:
            candidate_hexes = lip_colors_db[p]
            candidate_labs = [rgb_to_lab(hex_code) for hex_code in candidate_hexes]
            avg_delta = np.mean([delta_e(lip_lab, candidate_lab) for candidate_lab in candidate_labs])
            scores.append((p, avg_delta))

        # temperature scaling 적용: temperature 값을 높이면 후보 간 확률 분포가 부드러워집니다.
        import math
        temperature = 10.0  # 값이 클수록 후보들 간의 확률 차이가 덜 극명해집니다.
        similarities = [(p, math.exp(-score / temperature)) for p, score in scores]
        total_similarity = sum(sim for _, sim in similarities)
        probabilities = [(p, sim / total_similarity * 100) for p, sim in similarities]

        # 0%가 아닌 후보들만 필터링 후, 확률이 높은 순서대로 정렬하여 상위 3개 선택
        nonzero_probabilities = [(p, prob) for p, prob in probabilities if prob > 0.0]
        probabilities_sorted = sorted(nonzero_probabilities, key=lambda x: x[1], reverse=True)
        top_3 = probabilities_sorted[:3]

        response = {
            "lip_color": lip_hex,
            "diagnosis": [
                {
                    "rank": idx + 1,
                    "personal_color": personal_color_names.get(p, str(p)),
                    "probability": f"{prob:.2f}%"
                }
                for idx, (p, prob) in enumerate(top_3)
            ]
        }
        return jsonify(response), 200

    except Exception as e:
        logging.error(f"Lip prediction error: {traceback.format_exc()}")
        return jsonify({"error": "An error occurred during lip prediction"}), 500

# ─────────────────────────────────────────────
# /predict/combined API
# 립사진과 얼굴사진을 함께 받아 얼굴 기준 퍼스널컬러 진단 (상위 3위)과
# 립사진 기준 진단 (상위 3위, 확률) 및 립 색상을 응답합니다.
# ─────────────────────────────────────────────
# 얼굴 예측 결과의 영어 라벨을 퍼스널 컬러 후보 번호로 매핑 (예시)
english_to_candidate = {
    "autumn_dark": 9,
    "autumn_muted": 7,
    "autumn_strong": 8,
    "spring_light": 1,
    "spring_bright": 3,
    "spring_vivid": 2,
    "summer_light": 4,
    "summer_muted": 6,
    "summer_bright": 5,
    "winter_dark": 12,
    "winter_strong": 11,
    "winter_vivid": 10
}

# 영어 -> 한국어 라벨 매핑 (수정됨: "autumn_dark"는 "가을 웜 다크"로)
english_to_korean2 = {
    "autumn_dark": "가을 웜 다크",
    "autumn_muted": "가을 웜 뮤트",
    "autumn_strong": "가을 웜 스트롱",
    "spring_light": "봄 웜 라이트",
    "spring_bright": "봄 웜 브라이트",
    "spring_vivid": "봄 웜 비비드",
    "summer_light": "여름 쿨 라이트",
    "summer_muted": "여름 쿨 뮤트",
    "summer_bright": "여름 쿨 브라이트",
    "winter_dark": "겨울 쿨 다크",
    "winter_strong": "겨울 쿨 스트롱",
    "winter_vivid": "겨울 쿨 비비드"
}

@api.route('/predict/combined', methods=['POST'])
def predict_combined():
    # face_image와 lip_image가 모두 포함되어 있는지 확인
    if 'face_image' not in request.files or 'lip_image' not in request.files:
        return jsonify({"error": "Both 'face_image' and 'lip_image' files are required"}), 400

    try:
        #############################
        # 얼굴 사진 처리 (모델 기반 퍼스널 컬러 진단)
        #############################
        face_file = request.files['face_image']
        if face_file.filename == '':
            return jsonify({"error": "No face_image file selected"}), 400
        if not allowed_file(face_file.filename):
            return jsonify({"error": "Face image file type not allowed. Only PNG, JPG, JPEG are allowed."}), 400

        # process_image를 이용해 얼굴 영역 추출 및 모델 입력 생성
        image_array = process_image(face_file)
        top_3_face_results = predict_top_3(model, image_array, CATEGORIES)
        face_ranking = [
            {
                "rank": idx + 1,
                "personal_color": english_to_korean2.get(class_name, class_name),
                "probability": f"{prob:.2%}"
            }
            for idx, (class_name, prob) in enumerate(top_3_face_results)
        ]

        # 얼굴 예측 결과를 후보 번호 기반 dictionary로 변환 (확률은 fraction으로)
        face_prob_dict = {}
        face_top3_candidates = set()
        for class_name, prob in top_3_face_results:
            candidate_id = english_to_candidate.get(class_name)
            if candidate_id is not None:
                face_prob_dict[candidate_id] = prob
                face_top3_candidates.add(candidate_id)

        #############################
        # 립 사진 처리 (립 색상 추출 및 퍼스널 컬러 진단)
        #############################
        lip_file = request.files['lip_image']
        if lip_file.filename == '':
            return jsonify({"error": "No lip_image file selected"}), 400
        if not allowed_file(lip_file.filename):
            return jsonify({"error": "Lip image file type not allowed. Only PNG, JPG, JPEG are allowed."}), 400

        lip_bytes = np.frombuffer(lip_file.read(), np.uint8)
        lip_image = cv2.imdecode(lip_bytes, cv2.IMREAD_COLOR)
        if lip_image is None:
            return jsonify({"error": "Invalid lip_image file"}), 400

        # GrabCut을 이용해 립 영역에서 평균 색상 추출 (RGB 순서)
        lip_avg = extract_lip_color(lip_image)
        lip_hex = to_hex(lip_avg)
        lip_lab = rgb_to_lab(lip_hex)

        # 각 퍼스널 컬러 후보별 DeltaE 계산
        scores = []
        for p in lip_colors_db:
            candidate_hexes = lip_colors_db[p]
            candidate_labs = [rgb_to_lab(hex_code) for hex_code in candidate_hexes]
            avg_delta = np.mean([delta_e(lip_lab, candidate_lab) for candidate_lab in candidate_labs])
            scores.append((p, avg_delta))

        # temperature scaling 적용 (temperature 값이 클수록 확률 분포가 부드러워짐)
        import math
        temperature = 10.0
        similarities = [(p, math.exp(-score / temperature)) for p, score in scores]
        total_similarity = sum(sim for _, sim in similarities)
        # 확률은 fraction으로 계산 (나중에 매칭 계산에 사용)
        lip_probabilities = [(p, sim / total_similarity) for p, sim in similarities]
        top_3_lip = sorted(lip_probabilities, key=lambda x: x[1], reverse=True)[:3]

        lip_ranking = [
            {
                "rank": idx + 1,
                "personal_color": personal_color_names.get(p, str(p)),
                "probability": f"{prob * 100:.2f}%"
            }
            for idx, (p, prob) in enumerate(top_3_lip)
        ]

        # 립 예측 결과를 후보 번호 기반 dictionary로 변환
        lip_prob_dict = {p: prob for p, prob in lip_probabilities}
        lip_top3_candidates = set([p for p, _ in top_3_lip])

        #############################
        # 얼굴과 립이 어울릴 확률 계산 (스케일 팩터 적용)
        #############################
        # 동일 후보의 확률 곱 중 최댓값을 매칭 점수로 계산하고, 스케일 팩터를 곱해 전체적으로 높은 확률로 보정
        scaling_factor = 3.0  # 이 값을 조정하면 전체 확률을 높게 또는 낮게 조정할 수 있습니다.
        match_scores = []
        for candidate, f_prob in face_prob_dict.items():
            if candidate in lip_prob_dict:
                l_prob = lip_prob_dict[candidate]
                match_scores.append(f_prob * l_prob)
        if match_scores:
            matching_probability = min(100.0, max(match_scores) * 100 * scaling_factor)
        else:
            matching_probability = 0.0

        response = {
            "face_ranking": face_ranking,
            "lip_ranking": lip_ranking,
            "lip_color": lip_hex,
            "matching_probability": f"{matching_probability:.2f}%"
        }
        return jsonify(response), 200

    except Exception as e:
        logging.error(f"Combined prediction error: {traceback.format_exc()}")
        return jsonify({"error": "An error occurred during combined prediction"}), 500
