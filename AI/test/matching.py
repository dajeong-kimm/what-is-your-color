# 퍼스널 컬러별 대표 색상 (예제)
personal_colors = {
    1: "#FFB6C1",  # 봄 웜 라이트
    2: "#FF6347",  # 봄 웜 비비드
    3: "#FF4500",  # 봄 웜 브라이트
    4: "#FF69B4",  # 여름 쿨 라이트
    5: "#9370DB",  # 여름 쿨 브라이트
    6: "#DB7093",  # 여름 쿨 뮤트
    7: "#6B8E23",  # 가을 웜 뮤트
    8: "#B8860B",  # 가을 웜 스트롱
    9: "#8B4513",  # 가을 웜 다크
    10: "#FF0000", # 겨울 쿨 비비드
    11: "#B22222", # 겨울 쿨 스트롱
    12: "#8B0000"  # 겨울 쿨 다크
}

# 컬러별 LAB 변환
personal_lab = {k: rgb_to_lab(v) for k, v in personal_colors.items()}

# 피부색과 가장 가까운 퍼스널 컬러 찾기
min_distance = float("inf")
best_match = None

for p_id, lab in personal_lab.items():
    dist = delta_e(skin_light_lab, lab) + delta_e(skin_dark_lab, lab) + delta_e(eye_lab, lab) + delta_e(hair_lab, lab)
    if dist < min_distance:
        min_distance = dist
        best_match = p_id

print("가장 어울리는 퍼스널 컬러 ID:", best_match)
