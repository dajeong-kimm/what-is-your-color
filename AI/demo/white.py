import cv2
import numpy as np
import matplotlib.pyplot as plt
import mediapipe as mp
from skimage import color

# ─────────────────────────────────────────────
# 💡 1. A4 이미지 기반 LAB 화이트밸런싱
# ─────────────────────────────────────────────
def color_correction_lab(image, a4_image):
    """A4 이미지를 기준으로 LAB 색공간 기반 화이트밸런싱."""
    # A4 중심부의 화이트 컬러 추출
    h, w, _ = a4_image.shape
    a4_center = a4_image[h // 2, w // 2]
    
    # LAB 변환
    image_lab = color.rgb2lab(image / 255.0)
    a4_lab = color.rgb2lab([[a4_center / 255.0]])[0][0]

    # 명도(L) 및 컬러 보정
    L_target = 95
    L_correction = L_target - a4_lab[0]

    image_lab[:, :, 0] = np.clip(image_lab[:, :, 0] + L_correction, 0, 100)
    image_lab[:, :, 1] -= (a4_lab[1] * 0.7)
    image_lab[:, :, 2] -= (a4_lab[2] * 0.7)

    corrected = np.clip(color.lab2rgb(image_lab) * 255, 0, 255).astype(np.uint8)
    return corrected

# ─────────────────────────────────────────────
# 🧩 2. Mediapipe FaceMesh 기반 얼굴 크롭
# ─────────────────────────────────────────────
def crop_face_regions(image):
    """Mediapipe FaceMesh를 사용해 얼굴 부분 크롭."""
    mp_face_mesh = mp.solutions.face_mesh.FaceMesh(
        static_image_mode=True, max_num_faces=1, min_detection_confidence=0.5
    )
    results = mp_face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    mp_face_mesh.close()

    if not results.multi_face_landmarks:
        return None

    h, w, _ = image.shape
    landmarks = results.multi_face_landmarks[0].landmark

    regions = {
        "forehead": [10],
        "left_cheek": [234],
        "right_cheek": [454],
        "lips": [13],
        "left_eye": (33, 133),
        "right_eye": (362, 263),
    }

    region_images = []
    for _, indices in regions.items():
        if isinstance(indices, tuple):
            x = int((landmarks[indices[0]].x + landmarks[indices[1]].x) / 2 * w)
            y = int((landmarks[indices[0]].y + landmarks[indices[1]].y) / 2 * h)
        else:
            x = int(landmarks[indices[0]].x * w)
            y = int(landmarks[indices[0]].y * h)

        size = int(min(h, w) * 0.1)
        x_min, x_max = max(0, x - size // 2), min(w, x + size // 2)
        y_min, y_max = max(0, y - size // 2), min(h, y + size // 2)

        face_region = image[y_min:y_max, x_min:x_max]
        if face_region.size == 0:
            return None
        resized = cv2.resize(face_region, (64, 64))
        region_images.append(resized)

    if len(region_images) == len(regions):
        return np.concatenate(region_images, axis=1)
    return None

# ─────────────────────────────────────────────
# 📸 3. Before/After 시각화
# ─────────────────────────────────────────────
def show_before_after(original, a4_white_corrected, cropped):
    plt.figure(figsize=(12, 4))

    # Original Image
    plt.subplot(1, 3, 1)
    plt.title("📸 Original (Before)")
    plt.imshow(cv2.cvtColor(original, cv2.COLOR_BGR2RGB))
    plt.axis('off')

    # A4 White Balanced Image
    plt.subplot(1, 3, 2)
    plt.title("💡 A4 White Balanced (After)")
    plt.imshow(cv2.cvtColor(a4_white_corrected, cv2.COLOR_BGR2RGB))
    plt.axis('off')

    # Face Cropped Image
    plt.subplot(1, 3, 3)
    plt.title("🧩 Face Cropped (AI Preprocess)")
    if cropped is not None:
        plt.imshow(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
    else:
        plt.text(0.5, 0.5, "Face Not Detected", fontsize=12, ha='center')
    plt.axis('off')

    plt.show()

# ─────────────────────────────────────────────
# 🏃 4. 실행
# ─────────────────────────────────────────────
def main(face_image_path, a4_image_path):
    # Load Images
    original = cv2.imread(face_image_path)
    a4_image = cv2.imread(a4_image_path)

    if original is None:
        print("⚠️ 얼굴 이미지 로드 실패.")
        return
    if a4_image is None:
        print("⚠️ A4 이미지 로드 실패.")
        return

    # A4 기반 White Balance
    a4_white_corrected = color_correction_lab(original, a4_image)

    # Face Cropping (AI Preprocess)
    cropped = crop_face_regions(a4_white_corrected)

    # Show Before/After
    show_before_after(original, a4_white_corrected, cropped)

# 🖼️ 실행 예제
main('face_image.png', 'a4_image.png')
