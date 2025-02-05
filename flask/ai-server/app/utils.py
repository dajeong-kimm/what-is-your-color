import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from PIL import Image
import io
from skimage import color
from scipy.spatial import distance


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

# 1) RGB (hex) → LAB 변환 함수
def rgb_to_lab(hex_code):
    """
    Convert a hex color code to LAB color space.
    """
    hex_code = hex_code.lstrip("#")
    rgb = np.array([int(hex_code[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0
    lab = color.rgb2lab([[rgb]])[0][0]
    return lab

# 2) DeltaE 계산 함수
def delta_e(color1, color2):
    """
    Calculate the Euclidean distance between two LAB colors.
    """
    return distance.euclidean(color1, color2)

# 3) RGB → HEX 변환 함수
def to_hex(color):
    """
    Convert an RGB array to a hex color code.
    """
    return "#{:02X}{:02X}{:02X}".format(int(color[0]), int(color[1]), int(color[2]))

# 4) 이미지의 특정 영역의 평균 색상 추출
def get_average_color(image, x, y, size=5):
    """
    Get the average color of a region around (x, y) with a specified size.
    """
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    return np.mean(region, axis=(0, 1)) if region.size > 0 else np.array([0, 0, 0])

# 5) 어두운 색상 검출 (눈동자 등)
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

# 6) 밝은 색상 검출 (피부 하이라이트 등)
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

# 7) LAB 색공간을 이용한 화이트 밸런스 보정
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

# 8) Mediapipe를 이용한 얼굴 영역 색상 추출
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

# 9) 퍼스널 컬러 진단
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