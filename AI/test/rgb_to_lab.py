from skimage import color
import numpy as np

def rgb_to_lab(hex_code):
    """ HEX 코드 -> RGB (0~255) -> 정규화 (0~1) -> LAB 변환 """
    hex_code = hex_code.lstrip("#")
    rgb = np.array([int(hex_code[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0
    lab = color.rgb2lab([[rgb]])[0][0]
    return lab

# 예제 변환
skin_dark_lab = rgb_to_lab("#C08A75")
skin_light_lab = rgb_to_lab("#F4C2C2")
eye_lab = rgb_to_lab("#6B8E23")
hair_lab = rgb_to_lab("#8B4513")

print("LAB 변환값 (피부 어두운색):", skin_dark_lab)
print("LAB 변환값 (피부 밝은색):", skin_light_lab)
print("LAB 변환값 (눈동자 색):", eye_lab)
print("LAB 변환값 (머리 색):", hair_lab)
