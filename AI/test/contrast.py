from scipy.spatial import distance

def delta_e(color1, color2):
    """ LAB 색상 간 DeltaE 거리 계산 """
    return distance.euclidean(color1, color2)

# 피부 대비 계산
contrast = delta_e(skin_light_lab, skin_dark_lab)

print("피부 대비 값 (DeltaE):", contrast)

# 대비 기준 적용
if contrast > 30:
    contrast_level = "high"
elif contrast > 15:
    contrast_level = "medium"
else:
    contrast_level = "low"

print("대비 수준:", contrast_level)
