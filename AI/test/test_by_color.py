import cv2
import mediapipe as mp
import numpy as np
from skimage import color
from scipy.spatial import distance
import matplotlib.pyplot as plt

###########################################
# Helper Functions (변환/계산 함수들)
###########################################

# 1) RGB (hex) → LAB 변환 함수
def rgb_to_lab(hex_code):
    hex_code = hex_code.lstrip("#")
    rgb = np.array([int(hex_code[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0
    lab = color.rgb2lab([[rgb]])[0][0]
    return lab

# 2) 이미지 색상(RGB 배열)을 HEX 문자열로 변환 후 LAB로 변환
def image_rgb_to_lab(rgb_color):
    return rgb_to_lab(to_hex(rgb_color))

# 3) DeltaE 계산 함수
def delta_e(color1, color2):
    return distance.euclidean(color1, color2)

# 4) RGB → HEX 변환 함수
def to_hex(color):
    return "#{:02X}{:02X}{:02X}".format(int(color[0]), int(color[1]), int(color[2]))

# 5) 이미지의 (x, y) 주변 size×size 영역의 평균 색상 추출
def get_average_color(image, x, y, size=5):
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    return np.mean(region, axis=(0, 1)) if region.size > 0 else np.array([0, 0, 0])

# 6) 어두운 색(예: 눈동자) 검출 (영역 내 가장 어두운 픽셀)
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

# 7) 밝은 색(예: 피부 하이라이트) 검출 (영역 내 가장 밝은 픽셀)
def get_brightest_color(image, x, y, size=10):
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    if region.size == 0:
        return np.array([0, 0, 0])
    luminance = np.dot(region, [0.299, 0.587, 0.114])
    brightest_idx = np.unravel_index(np.argmax(luminance), luminance.shape)
    return region[brightest_idx]

# 8) LAB 색공간을 이용한 A4 색 보정 (화이트 밸런스 보정)
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

# 별도로 personal_color_names (출력용)
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

###########################################
# Mediapipe를 이용한 얼굴 랜드마크 기반 색상 추출 함수 (머리카락색 개선)
###########################################
def extract_face_colors(image):
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
        # 피부 평균색: 얼굴 중앙 근처 (landmark 1)
        center = landmarks[1]
        skin_avg = get_average_color(image, int(center.x * w), int(center.y * h), size=15)
        
        # 피부 하이라이트: 양쪽 뺨 (landmarks 234, 454) 중 더 밝은 쪽 선택
        left_cheek = landmarks[234]
        right_cheek = landmarks[454]
        skin_bright_left = get_brightest_color(image, int(left_cheek.x * w), int(left_cheek.y * h), size=15)
        skin_bright_right = get_brightest_color(image, int(right_cheek.x * w), int(right_cheek.y * h), size=15)
        lum_left = np.dot(skin_bright_left, [0.299, 0.587, 0.114])
        lum_right = np.dot(skin_bright_right, [0.299, 0.587, 0.114])
        skin_bright = skin_bright_left if lum_left >= lum_right else skin_bright_right
        
        # 눈동자색: 왼쪽 눈 중심 (landmark 159)에서 어두운 픽셀
        eye = landmarks[159]
        eye_color = get_darkest_color(image, int(eye.x * w), int(eye.y * h), size=10)
        
        # 머리카락색 추출 개선:
        # 1) 모든 landmark의 y좌표 중 최솟값(얼굴의 가장 높은 지점)을 찾음
        all_y = [lm.y for lm in landmarks]
        top_y = min(all_y)
        # 2) 얼굴 전체의 x좌표 평균(얼굴 중심)을 구함
        all_x = [lm.x for lm in landmarks]
        center_x = np.mean(all_x)
        # 3) 얼굴의 가장 높은 지점 위쪽 (예: 30픽셀 위)에서 색상 샘플링
        offset = 30  # 조정 가능한 픽셀 오프셋
        hair_sample_y = max(int(top_y * h) - offset, 0)
        hair_sample_x = int(center_x * w)
        hair_color = get_average_color(image, hair_sample_x, hair_sample_y, size=10)
        
        return skin_avg, skin_bright, eye_color, hair_color
    else:
        return None

###########################################
# 새로운 진단 함수: 피부의 평균색, 눈동자색, 머리카락색을 이용하여 DB(립, 치크, eye) 비교
###########################################
def find_personal_color_using_skin_avg(skin_avg, eye_color, hair_color):
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
        # 피부 영역은 skin_avg만 사용 (skin_bright는 무시)
        total_diff = comp_diff(skin_avg) + comp_diff(eye_color) + comp_diff(hair_color)
        scores.append((p, total_diff))
    return sorted(scores, key=lambda x: x[1])

###########################################
# 시각화를 위한 함수: 추출한 색상 swatch 출력 (4종류)
###########################################
def display_extracted_colors_new(skin_avg, skin_bright, eye_color, hair_color, title_prefix=""):
    skin_avg_hex = to_hex(skin_avg)
    skin_bright_hex = to_hex(skin_bright)
    eye_hex = to_hex(eye_color)
    hair_hex = to_hex(hair_color)
    
    fig, ax = plt.subplots(1, 4, figsize=(16, 4))
    ax[0].imshow(np.full((100, 100, 3), skin_avg.astype(np.uint8)))
    ax[0].set_title(f"{title_prefix}\nSkin Avg\n{skin_avg_hex}")
    ax[0].axis("off")
    ax[1].imshow(np.full((100, 100, 3), skin_bright.astype(np.uint8)))
    ax[1].set_title(f"{title_prefix}\nSkin Bright\n{skin_bright_hex}")
    ax[1].axis("off")
    ax[2].imshow(np.full((100, 100, 3), eye_color.astype(np.uint8)))
    ax[2].set_title(f"{title_prefix}\nEye\n{eye_hex}")
    ax[2].axis("off")
    ax[3].imshow(np.full((100, 100, 3), hair_color.astype(np.uint8)))
    ax[3].set_title(f"{title_prefix}\nHair\n{hair_hex}")
    ax[3].axis("off")
    plt.show()

###########################################
# 실행 코드
###########################################
a4_image_path = "a4_image.png"
face_image_path = "face_image.png"

# 이미지 파일 읽기
a4_image = cv2.imread(a4_image_path)
face_image = cv2.imread(face_image_path)

if a4_image is None or face_image is None:
    print("이미지 파일을 불러오지 못했습니다.")
else:
    # BGR → RGB 변환
    a4_rgb = cv2.cvtColor(a4_image, cv2.COLOR_BGR2RGB)
    face_rgb = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)
    
    # A4 이미지 중앙에서 화이트 레퍼런스 색 추출 후 얼굴 이미지 색 보정
    a4_x, a4_y = a4_rgb.shape[1] // 2, a4_rgb.shape[0] // 2
    white_ref = get_average_color(a4_rgb, a4_x, a4_y)
    corrected_face = color_correction_lab(face_rgb, white_ref)
    
    # Mediapipe를 이용하여 얼굴 영역에서 4가지 색상 추출 (원본과 보정 후 각각)
    extracted_orig = extract_face_colors(face_rgb)
    extracted_corr = extract_face_colors(corrected_face)
    
    if extracted_orig is None or extracted_corr is None:
        print("얼굴 랜드마크를 찾지 못했습니다.")
    else:
        # 추출된 색상: skin_avg, skin_bright, eye_color, hair_color
        skin_avg_orig, skin_bright_orig, eye_color_orig, hair_color_orig = extracted_orig
        skin_avg_corr, skin_bright_corr, eye_color_corr, hair_color_corr = extracted_corr
        
        # 진단: 피부 평균색, 눈동자색, 머리카락색을 이용하여 DB 비교 (skin_bright는 무시)
        ranking_orig = find_personal_color_using_skin_avg(skin_avg_orig, eye_color_orig, hair_color_orig)
        ranking_corr = find_personal_color_using_skin_avg(skin_avg_corr, eye_color_corr, hair_color_corr)
        
        print("----- 원본 이미지 (색보정 전) 퍼스널 컬러 진단 결과 -----")
        for rank, (p_id, score) in enumerate(ranking_orig, start=1):
            name = personal_color_names[p_id]
            print(f"{rank}. {name} (total ΔE: {score:.2f})")
        
        print("\n----- 색 보정 후 이미지 퍼스널 컬러 진단 결과 -----")
        for rank, (p_id, score) in enumerate(ranking_corr, start=1):
            name = personal_color_names[p_id]
            print(f"{rank}. {name} (total ΔE: {score:.2f})")
        
        # 추출한 색상 swatch 시각화
        print("\n[원본 이미지에서 추출한 색상]")
        display_extracted_colors_new(skin_avg_orig, skin_bright_orig, eye_color_orig, hair_color_orig, title_prefix="원본")
        print("[보정 후 이미지에서 추출한 색상]")
        display_extracted_colors_new(skin_avg_corr, skin_bright_corr, eye_color_corr, hair_color_corr, title_prefix="보정 후")
        
        # 원본과 보정 후 이미지 비교 시각화
        def compare_color_correction(original, corrected):
            fig, ax = plt.subplots(1, 2, figsize=(10, 5))
            ax[0].imshow(original)
            ax[0].set_title("원본 이미지")
            ax[0].axis("off")
            ax[1].imshow(corrected)
            ax[1].set_title("색 보정 후 이미지")
            ax[1].axis("off")
            plt.show()
        
        compare_color_correction(face_rgb, corrected_face)
