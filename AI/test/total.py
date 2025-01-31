from skimage import color
import numpy as np
from scipy.spatial import distance

def rgb_to_lab(hex_code):
    """ HEX 코드 -> RGB (0~255) -> 정규화 (0~1) -> LAB 변환 """
    hex_code = hex_code.lstrip("#")
    rgb = np.array([int(hex_code[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0
    lab = color.rgb2lab([[rgb]])[0][0]
    return lab

def delta_e(color1, color2):
    """ LAB 색상 간 DeltaE 거리 계산 """
    return distance.euclidean(color1, color2)

# ✅ 예제 변환 (입력된 색상값 변환)
skin_dark_lab = rgb_to_lab("#E0A4B8")
skin_light_lab = rgb_to_lab("#F8D7DA")
eye_lab = rgb_to_lab("#A9A9A9")
hair_lab = rgb_to_lab("#8B8589")

print("LAB 변환값 (피부 어두운색):", skin_dark_lab)
print("LAB 변환값 (피부 밝은색):", skin_light_lab)
print("LAB 변환값 (눈동자 색):", eye_lab)
print("LAB 변환값 (머리 색):", hair_lab)

# ✅ 퍼스널 컬러별 Best & Worst 컬러 정의
# ✅ 퍼스널 컬러별 Best & Worst 컬러 정의
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


# ✅ 컬러별 LAB 변환
personal_lab = {}
for p_id, (name, best_colors, worst_colors) in personal_colors.items():
    best_lab = [rgb_to_lab(color) for color in best_colors]
    worst_lab = [rgb_to_lab(color) for color in worst_colors]
    personal_lab[p_id] = (name, best_lab, worst_lab)

# ✅ 가장 어울리는 퍼스널 컬러 찾기
min_score = float("inf")
best_match_id = None
best_match_name = None

for p_id, (name, best_labs, worst_labs) in personal_lab.items():
    # Best 컬러 전체 평균 거리 계산
    best_distance = sum(
        delta_e(skin_light_lab, lab) + delta_e(skin_dark_lab, lab) +
        delta_e(eye_lab, lab) + delta_e(hair_lab, lab)
        for lab in best_labs
    ) / len(best_labs)

    # Worst 컬러 전체 평균 거리 계산 (멀수록 좋음, 가중치 증가)
    worst_distance = sum(
        delta_e(skin_light_lab, lab) + delta_e(skin_dark_lab, lab) +
        delta_e(eye_lab, lab) + delta_e(hair_lab, lab)
        for lab in worst_labs
    ) / len(worst_labs)

    # 피부 대비도 추가 반영 (명도 차이 증가)
    contrast_factor = abs(skin_light_lab[0] - skin_dark_lab[0]) / 5  

    # 최종 점수 계산
    score = best_distance - (1.2 * worst_distance) - contrast_factor  

    if score < min_score:
        min_score = score
        best_match_id = p_id
        best_match_name = name

print("가장 어울리는 퍼스널 컬러 ID:", best_match_id)
print("가장 어울리는 퍼스널 컬러 이름:", best_match_name)
