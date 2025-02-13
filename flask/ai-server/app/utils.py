import numpy as np
import cv2
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from PIL import Image
import io
from skimage import color
from scipy.spatial import distance
import mediapipe as mp

# ─────────────────────────────────────────────
# 1. 얼굴 영역 크롭 및 결합 (새 모델 전처리)
# ─────────────────────────────────────────────
def crop_face_regions(image):
    """
    업로드된 이미지에서 Mediapipe Face Mesh를 이용해
    얼굴의 특정 영역(이마, 좌측 볼, 우측 볼, 입술, 좌측 눈, 우측 눈)을 크롭하고,
    각각 64x64 크기로 리사이즈한 후 좌우로 이어붙여 (64, 384, 3) 형태의 이미지를 반환합니다.
    """
    mp_face_mesh = mp.solutions.face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
        min_detection_confidence=0.5
    )
    # Mediapipe 처리를 위해 BGR 이미지를 RGB로 변환
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = mp_face_mesh.process(image_rgb)
    mp_face_mesh.close()
    if not results.multi_face_landmarks:
        return None

    h, w, _ = image.shape
    landmarks = results.multi_face_landmarks[0].landmark

    # 각 영역에 해당하는 랜드마크 인덱스 (튜닝 가능)
    region_map = {
        "forehead": [10],
        "left_cheek": [234],
        "right_cheek": [454],
        "lips": [13],
        "left_eye": (33, 133),
        "right_eye": (362, 263)
    }

    regions = []
    for key, indices in region_map.items():
        if isinstance(indices, tuple):
            x = int((landmarks[indices[0]].x + landmarks[indices[1]].x) / 2 * w)
            y = int((landmarks[indices[0]].y + landmarks[indices[1]].y) / 2 * h)
        else:
            x = int(landmarks[indices[0]].x * w)
            y = int(landmarks[indices[0]].y * h)

        # 얼굴 크기에 비례하는 영역 크기 (전체 크기의 10% 사용)
        size = int(min(h, w) * 0.1)
        x_min = max(0, x - size // 2)
        x_max = min(w, x + size // 2)
        y_min = max(0, y - size // 2)
        y_max = min(h, y + size // 2)

        region = image[y_min:y_max, x_min:x_max]
        if region.size == 0:
            return None
        # 각 영역을 64x64 크기로 리사이즈
        region_resized = cv2.resize(region, (64, 64))
        regions.append(region_resized)
    if len(regions) == len(region_map):
        # 좌우로 이어붙여 (64, 64*6=384, 3) 크기의 이미지 생성
        concatenated = np.concatenate(regions, axis=1)
        return concatenated
    else:
        return None

# ─────────────────────────────────────────────
# 2. 이미지 전처리 함수 (새 모델용)
# ─────────────────────────────────────────────
def process_image(image_file):
    """
    업로드된 파일 객체에서 이미지를 디코딩한 후,
    얼굴 영역을 추출하여 모델 입력에 맞게 전처리합니다.
    최종 입력 크기는 (1, 64, 384, 3)이며, 픽셀 값은 0~1로 정규화됩니다.
    """
    file_bytes = np.frombuffer(image_file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("이미지 디코딩에 실패했습니다.")
    processed_image = crop_face_regions(image)
    if processed_image is None:
        raise ValueError("얼굴 영역 추출에 실패했습니다.")
    processed_image = processed_image.astype(np.float32) / 255.0
    processed_image = np.expand_dims(processed_image, axis=0)
    return processed_image

# ─────────────────────────────────────────────
# 3. 예측 결과 상위 3개 클래스 반환 함수
# ─────────────────────────────────────────────
def predict_top_3(model, image_array, categories):
    """
    모델이 예측한 상위 3개의 클래스와 확률을 반환합니다.
    """
    predictions = model.predict(image_array)
    predictions = predictions[0]  # 배치 차원 제거
    top_indices = predictions.argsort()[-3:][::-1]
    top_3 = [(categories[i], predictions[i]) for i in top_indices]
    return top_3

# ─────────────────────────────────────────────
# 4. RGB (hex) → LAB 변환 함수
# ─────────────────────────────────────────────
def rgb_to_lab(hex_code):
    """
    Convert a hex color code to LAB color space.
    """
    hex_code = hex_code.lstrip("#")
    rgb = np.array([int(hex_code[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0
    lab = color.rgb2lab([[rgb]])[0][0]
    return lab

# ─────────────────────────────────────────────
# 5. DeltaE 계산 함수
# ─────────────────────────────────────────────
def delta_e(color1, color2):
    """
    Calculate the Euclidean distance between two LAB colors.
    """
    return distance.euclidean(color1, color2)

# ─────────────────────────────────────────────
# 6. RGB → HEX 변환 함수
# ─────────────────────────────────────────────
def to_hex(color):
    """
    Convert an RGB array to a hex color code.
    """
    return "#{:02X}{:02X}{:02X}".format(int(color[0]), int(color[1]), int(color[2]))

# ─────────────────────────────────────────────
# 7. 이미지의 특정 영역의 평균 색상 추출
# ─────────────────────────────────────────────
def get_average_color(image, x, y, size=5):
    """
    Get the average color of a region around (x, y) with a specified size.
    """
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    return np.mean(region, axis=(0, 1)) if region.size > 0 else np.array([0, 0, 0])

# ─────────────────────────────────────────────
# 8. 어두운 색상 검출 (눈동자 등)
# ─────────────────────────────────────────────
def get_darkest_color(image, x, y, size=10):
    """
    Get the darkest color in a region around (x, y).
    """
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    if region.size == 0:
        return np.array([0, 0, 0])
    luminance = np.dot(region, [0.299, 0.587, 0.114])
    darkest_idx = np.unravel_index(np.argmin(luminance), luminance.shape)
    return region[darkest_idx]

# ─────────────────────────────────────────────
# 9. 밝은 색상 검출 (피부 하이라이트 등)
# ─────────────────────────────────────────────
def get_brightest_color(image, x, y, size=10):
    """
    Get the brightest color in a region around (x, y).
    """
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    if region.size == 0:
        return np.array([0, 0, 0])
    luminance = np.dot(region, [0.299, 0.587, 0.114])
    brightest_idx = np.unravel_index(np.argmax(luminance), luminance.shape)
    return region[brightest_idx]

# ─────────────────────────────────────────────
# 10. LAB 색공간을 이용한 화이트 밸런스 보정
# ─────────────────────────────────────────────
def color_correction_lab(image, white_ref):
    """
    Perform white balance correction in LAB color space.
    """
    image_lab = color.rgb2lab(image / 255.0)
    white_ref_lab = color.rgb2lab([[white_ref / 255.0]])[0][0]
    # L(명도) 보정
    L_target = 95
    L_correction = L_target - white_ref_lab[0]
    image_lab[:, :, 0] = np.clip(image_lab[:, :, 0] + L_correction, 0, 100)
    # A/B 채널 보정 (웜톤 과잉 방지)
    A_target, B_target = 0, 0
    A_correction = A_target - white_ref_lab[1]
    B_correction = B_target - white_ref_lab[2]
    image_lab[:, :, 1] = np.clip(image_lab[:, :, 1] + A_correction * 0.7, -128, 127)
    image_lab[:, :, 2] = np.clip(image_lab[:, :, 2] + B_correction * 0.7, -128, 127)
    return np.clip(color.lab2rgb(image_lab) * 255, 0, 255).astype(np.uint8)

# ─────────────────────────────────────────────
# 11. Mediapipe를 이용한 얼굴 영역 색상 추출
# ─────────────────────────────────────────────
def extract_face_colors(image):
    """
    Extract average skin, brightest skin, darkest eye, and average hair colors using Mediapipe landmarks.
    """
    import mediapipe as mp
    mp_face_mesh = mp.solutions.face_mesh.FaceMesh(
        static_image_mode=True, 
        max_num_faces=1, 
        refine_landmarks=True
    )
    results = mp_face_mesh.process(image)
    mp_face_mesh.close()
    if results.multi_face_landmarks:
        landmarks = results.multi_face_landmarks[0].landmark
        h, w, _ = image.shape
        # 피부 평균색
        center = landmarks[1]
        skin_avg = get_average_color(image, int(center.x * w), int(center.y * h), size=15)
        # 피부 하이라이트
        left_cheek = landmarks[234]
        right_cheek = landmarks[454]
        skin_bright_left = get_brightest_color(image, int(left_cheek.x * w), int(left_cheek.y * h), size=15)
        skin_bright_right = get_brightest_color(image, int(right_cheek.x * w), int(right_cheek.y * h), size=15)
        skin_bright = skin_bright_left if np.dot(skin_bright_left, [0.299, 0.587, 0.114]) >= np.dot(skin_bright_right, [0.299, 0.587, 0.114]) else skin_bright_right
        # 눈동자 색상
        eye = landmarks[159]
        eye_color = get_darkest_color(image, int(eye.x * w), int(eye.y * h), size=10)
        # 머리카락 평균색
        top_y = min(lm.y for lm in landmarks)
        center_x = np.mean([lm.x for lm in landmarks])
        hair_sample_y = max(int(top_y * h) - 30, 0)
        hair_sample_x = int(center_x * w)
        hair_color = get_average_color(image, hair_sample_x, hair_sample_y, size=10)
        return skin_avg, skin_bright, eye_color, hair_color
    else:
        return None

# ─────────────────────────────────────────────
# 12. 퍼스널 컬러 진단
# ─────────────────────────────────────────────
def find_personal_color_using_skin_avg(skin_avg, eye_color, hair_color, lip_colors_db, cheek_colors_db, eye_palette_db):
    """
    Diagnose personal color using skin, eye, and hair colors.
    """
    scores = []
    for p in range(1, 13):
        lip_lab_list = [rgb_to_lab(c) for c in lip_colors_db[p]]
        cheek_lab_list = [rgb_to_lab(c) for c in cheek_colors_db[p]]
        eye_lab_list = [rgb_to_lab(c) for c in eye_palette_db[p]]
        def comp_diff(x_color):
            x_lab = rgb_to_lab(to_hex(x_color))
            diff_lip = min(delta_e(x_lab, lab) for lab in lip_lab_list)
            diff_cheek = min(delta_e(x_lab, lab) for lab in cheek_lab_list)
            diff_eye = min(delta_e(x_lab, lab) for lab in eye_lab_list)
            return (diff_lip + diff_cheek + diff_eye) / 3.0
        total_diff = comp_diff(skin_avg) + comp_diff(eye_color) + comp_diff(hair_color)
        scores.append((p, total_diff))
    return sorted(scores, key=lambda x: x[1])
