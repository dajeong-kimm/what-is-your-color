import cv2
import mediapipe as mp
import numpy as np
import matplotlib.pyplot as plt

# ✅ 픽셀 주변 색상 평균 계산 함수
def get_average_color(image, x, y, size=5):
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]
    if region.size == 0:
        return np.array([0, 0, 0])  # 기본값 (검정색) 반환
    avg_color = np.mean(region, axis=(0, 1))
    return avg_color

# ✅ 가장 어두운 픽셀의 색상 추출
def get_darkest_color(image, x, y, size=10):
    h, w, _ = image.shape
    x_start, x_end = max(x - size, 0), min(x + size, w)
    y_start, y_end = max(y - size, 0), min(y + size, h)
    region = image[y_start:y_end, x_start:x_end]

    if region.size == 0:
        return np.array([0, 0, 0])  # 기본값 (검정색) 반환

    # 밝기(Luminance) 계산
    luminance = np.dot(region, [0.299, 0.587, 0.114])
    darkest_idx = np.unravel_index(np.argmin(luminance), luminance.shape)
    darkest_color = region[darkest_idx]
    return darkest_color

# ✅ RGB → HEX 변환 함수
def to_hex(color):
    if np.isnan(color).any():
        color = [0, 0, 0]  # 기본값 (검정색) 설정
    return "#{:02X}{:02X}{:02X}".format(int(color[0]), int(color[1]), int(color[2]))

# ✅ Mediapipe 얼굴 검출 및 색상 추출
def extract_colors(image_path):
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)

    image = cv2.imread(image_path)
    if image is None:
        print(f"이미지 파일을 불러오지 못했습니다. 경로를 확인하세요: {image_path}")
        return None

    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(image_rgb)

    if not results.multi_face_landmarks:
        print("얼굴을 찾을 수 없습니다.")
        return None

    landmarks = results.multi_face_landmarks[0].landmark
    h, w, _ = image.shape

    # ✅ 피부 색상 추출
    skin_points = [landmarks[i] for i in [1, 5, 9, 132, 361, 50, 280, 58, 286]]
    skin_colors = []
    for p in skin_points:
        x, y = int(p.x * w), int(p.y * h)
        if 0 <= x < w and 0 <= y < h:
            skin_colors.append(get_average_color(image_rgb, x, y))

    if not skin_colors:
        print("피부 색상을 추출하지 못했습니다.")
        return None

    skin_avg = np.mean(skin_colors, axis=0)
    brightness = [np.dot(c, [0.299, 0.587, 0.114]) for c in skin_colors]
    skin_lightest = skin_colors[np.argmax(brightness)] if brightness else [0, 0, 0]

    # ✅ 눈동자 검정 부분 색상 추출
    eye_points = [landmarks[i] for i in [33, 133, 362, 263]]  # 눈 영역 좌표
    eye_colors = []
    for p in eye_points:
        x, y = int(p.x * w), int(p.y * h)
        if 0 <= x < w and 0 <= y < h:
            eye_colors.append(get_darkest_color(image_rgb, x, y))
    eye_avg = np.mean(eye_colors, axis=0).astype(int) if eye_colors else [0, 0, 0]

    # ✅ 머리카락 색상 추출 (이마 위쪽)
    forehead_x = int(landmarks[10].x * w)
    forehead_y = max(int(landmarks[10].y * h) - 50, 0)
    forehead_color = get_average_color(image_rgb, forehead_x, forehead_y, size=20)

    # ✅ RGB → HEX 변환
    skin_hex = to_hex(skin_avg)
    skin_light_hex = to_hex(skin_lightest)
    eye_hex = to_hex(eye_avg)
    hair_hex = to_hex(forehead_color)

    return skin_hex, skin_light_hex, eye_hex, hair_hex

# ✅ 추출된 색상 시각화
def visualize_colors(skin_hex, skin_light_hex, eye_hex, hair_hex):
    colors = [skin_hex, skin_light_hex, eye_hex, hair_hex]
    labels = ["Skin Avg", "Skin Lightest", "Eye (Dark)", "Hair"]

    # ✅ 색상 시각화
    fig, ax = plt.subplots(1, len(colors), figsize=(10, 2))
    for i, (color, label) in enumerate(zip(colors, labels)):
        ax[i].set_facecolor(color)
        ax[i].set_xticks([])
        ax[i].set_yticks([])
        ax[i].set_title(f"{label}\n{color}", fontsize=10, color="black")
    plt.show()

# ✅ 실행 코드
image_path = "face.jpg"  # 이미지 경로
result = extract_colors(image_path)

if result:
    skin_hex, skin_light_hex, eye_hex, hair_hex = result
    print(f"평균 피부 색상: {skin_hex}")
    print(f"가장 밝은 피부 색상: {skin_light_hex}")
    print(f"추출된 눈동자 색상(어두운 부분): {eye_hex}")
    print(f"추출된 머리 색상: {hair_hex}")

    # ✅ 시각화 함수 호출
    visualize_colors(skin_hex, skin_light_hex, eye_hex, hair_hex)
else:
    print("색상 추출 실패!")
