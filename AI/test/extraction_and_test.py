import cv2
import mediapipe as mp
import numpy as np
from skimage import color
from scipy.spatial import distance
import matplotlib.pyplot as plt

# ✅ RGB → LAB 변환 함수
def rgb_to_lab(hex_code):
    hex_code = hex_code.lstrip("#")
    rgb = np.array([int(hex_code[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0
    lab = color.rgb2lab([[rgb]])[0][0]
    return lab

# ✅ DeltaE 계산 함수
def delta_e(color1, color2):
    return distance.euclidean(color1, color2)

# ✅ RGB → HEX 변환 함수
def to_hex(color):
    return "#{:02X}{:02X}{:02X}".format(int(color[0]), int(color[1]), int(color[2]))

# ✅ Mediapipe로 색상 추출
def get_average_color(image, x, y, size=5):
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    return np.mean(region, axis=(0, 1)) if region.size > 0 else np.array([0, 0, 0])

def get_darkest_color(image, x, y, size=10):
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    if region.size == 0:
        return np.array([0, 0, 0])
    luminance = np.dot(region, [0.299, 0.587, 0.114])
    darkest_idx = np.unravel_index(np.argmin(luminance), luminance.shape)
    return region[darkest_idx]

# ✅ LAB 색공간을 이용한 A4 색 보정
def color_correction_lab(image, white_ref):
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

# ✅ 퍼스널 컬러 데이터 (보정)
personal_colors = {
    1: ("봄 웜 라이트", ["#FFB6C1", "#FFDAB9", "#FFFFE0", "#F4A460", "#98FB98"], ["#8B4513", "#800000", "#4B0082", "#2F4F4F", "#000000"]),
    2: ("봄 웜 비비드", ["#FF6347", "#FFA07A", "#FFD700", "#FF7F50", "#00FA9A"], ["#8B4513", "#800000", "#4B0082", "#2F4F4F", "#000000"]),
    3: ("봄 웜 브라이트", ["#FF4500", "#FF8C00", "#FFFF00", "#FFA500", "#00FF7F"], ["#8B4513", "#800000", "#4B0082", "#2F4F4F", "#000000"]),
    4: ("여름 쿨 라이트", ["#FF69B4", "#E6E6FA", "#87CEEB", "#98FB98", "#DDA0DD"], ["#FFD700", "#808000", "#B22222", "#FF4500", "#FFD700"]),
    5: ("여름 쿨 브라이트", ["#FF1493", "#9370DB", "#00BFFF", "#00FA9A", "#8A2BE2"], ["#FFD700", "#808000", "#B22222", "#FF4500", "#FFD700"]),
    6: ("여름 쿨 뮤트", ["#DB7093", "#D8BFD8", "#B0E0E6", "#AFEEEE", "#DDA0DD"], ["#FFD700", "#808000", "#B22222", "#FF4500", "#FFD700"]),
    7: ("가을 웜 뮤트", ["#6B8E23", "#DAA520", "#D2691E", "#556B2F", "#A52A2A"], ["#FFB6C1", "#E6E6FA", "#87CEEB", "#98FB98", "#C0C0C0"]),
    8: ("가을 웜 스트롱", ["#556B2F", "#B8860B", "#8B4513", "#8B0000", "#A52A2A"], ["#FFB6C1", "#E6E6FA", "#87CEEB", "#98FB98", "#C0C0C0"]),
    9: ("가을 웜 다크", ["#8B4513", "#A0522D", "#A52A2A", "#8B0000", "#654321"], ["#FFB6C1", "#E6E6FA", "#87CEEB", "#98FB98", "#C0C0C0"]),
    10: ("겨울 쿨 비비드", ["#FF0000", "#FF00FF", "#0000FF", "#8A2BE2", "#00FF00"], ["#FFA500", "#FFD700", "#A52A2A", "#808000", "#F5F5DC"]),
    11: ("겨울 쿨 스트롱", ["#B22222", "#C71585", "#00008B", "#4B0082", "#006400"], ["#FFA500", "#FFD700", "#A52A2A", "#808000", "#F5F5DC"]),
    12: ("겨울 쿨 다크", ["#8B0000", "#00008B", "#006400", "#4B0082", "#000000"], ["#FFA500", "#FFD700", "#A52A2A", "#808000", "#F5F5DC"]),
}

# ✅ LAB 변환
personal_lab = {p_id: (name, [rgb_to_lab(c) for c in best], [rgb_to_lab(c) for c in worst]) 
                for p_id, (name, best, worst) in personal_colors.items()}

# ✅ 퍼스널 컬러 계산
def find_personal_color(skin_avg, skin_lightest, eye_avg, hair_avg):
    skin_avg_lab = rgb_to_lab(to_hex(skin_avg))
    skin_light_lab = rgb_to_lab(to_hex(skin_lightest))
    eye_lab = rgb_to_lab(to_hex(eye_avg))
    hair_lab = rgb_to_lab(to_hex(hair_avg))

    color_scores = []
    
    for p_id, (name, best_labs, worst_labs) in personal_lab.items():
        skin_score = max(delta_e(skin_avg_lab, lab) for lab in worst_labs) - min(delta_e(skin_avg_lab, lab) for lab in best_labs)
        light_score = max(delta_e(skin_light_lab, lab) for lab in worst_labs) - min(delta_e(skin_light_lab, lab) for lab in best_labs)
        eye_score = max(delta_e(eye_lab, lab) for lab in worst_labs) - min(delta_e(eye_lab, lab) for lab in best_labs)
        hair_score = max(delta_e(hair_lab, lab) for lab in worst_labs) - min(delta_e(hair_lab, lab) for lab in best_labs)

        final_score = skin_score * 0.3 + light_score * 0.2 + eye_score * 0.25 + hair_score * 0.25
        color_scores.append((name, final_score))

    return sorted(color_scores, key=lambda x: x[1], reverse=True)

# ✅ 실행 코드
a4_image_path = "a4_image.png"
face_image_path = "face_image.png"

a4_image = cv2.imread(a4_image_path)
face_image = cv2.imread(face_image_path)

if a4_image is None or face_image is None:
    print("이미지 파일을 불러오지 못했습니다.")
else:
    a4_rgb = cv2.cvtColor(a4_image, cv2.COLOR_BGR2RGB)
    face_rgb = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)

    a4_x, a4_y = a4_rgb.shape[1] // 2, a4_rgb.shape[0] // 2
    white_ref = get_average_color(a4_rgb, a4_x, a4_y)
    corrected_face = color_correction_lab(face_rgb, white_ref)

    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)
    results = face_mesh.process(corrected_face)

    if results.multi_face_landmarks:
        skin_avg = get_average_color(corrected_face, 100, 100)
        eye_avg = get_darkest_color(corrected_face, 150, 150)
        hair_avg = get_average_color(corrected_face, 50, 50)

        color_scores = find_personal_color(skin_avg, skin_avg, eye_avg, hair_avg)
        print("\n퍼스널 컬러 순위:")
        for rank, (name, score) in enumerate(color_scores, start=1):
            print(f"{rank}. {name} (점수: {score:.2f})")
def compare_color_correction(original, corrected):
    fig, ax = plt.subplots(1, 2, figsize=(10, 5))

    # 원본 얼굴 이미지
    ax[0].imshow(original)
    ax[0].set_title("원본 이미지")
    ax[0].axis("off")

    # 색 보정된 얼굴 이미지
    ax[1].imshow(corrected)
    ax[1].set_title("색 보정 후 이미지")
    ax[1].axis("off")

    plt.show()

# ✅ 색 보정 전후 비교 실행
compare_color_correction(face_rgb, corrected_face)