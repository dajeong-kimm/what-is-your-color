import os
import cv2
import albumentations as A

num_augmented_images = 20  # 이미지당 증강 개수

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# 증강 설정
transform = A.Compose([
    A.OneOf([
        A.RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.5),
        A.HueSaturationValue(hue_shift_limit=20, sat_shift_limit=30, val_shift_limit=20, p=0.5),
    ]),
    A.GaussNoise(var_limit=(10.0, 50.0), p=0.5)
])

# 폴더 생성 함수
def create_folder(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def is_allowed_file(file_name):
    return '.' in file_name and file_name.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 원본 폴더 및 저장 폴더 설정
source_folder = r"C:\Users\SSAFY\Desktop\personal_color"  # 원본 이미지 폴더 경로
output_folder = r"C:\Users\SSAFY\Desktop\augmented"  # 증강 이미지 저장 폴더 경로

# 모든 폴더 순회
for category in os.listdir(source_folder):
    category_path = os.path.join(source_folder, category)
    output_category_path = os.path.join(output_folder, category)
    create_folder(output_category_path)

    if os.path.isdir(category_path):
        for file_name in os.listdir(category_path):
            file_path = os.path.join(category_path, file_name)

            if not is_allowed_file(file_name):
                print(f"허용되지 않은 파일 형식: {file_name}")
                continue

            image = cv2.imread(file_path)
            if image is None:
                print(f"이미지를 읽을 수 없습니다: {file_path}")
                continue

            for i in range(num_augmented_images):
                try:
                    augmented = transform(image=image)['image']
                    output_file_path = os.path.join(output_category_path, f"aug_{i}_{file_name}")
                    success = cv2.imwrite(output_file_path, augmented)
                    if not success:
                        print(f"저장 실패: {output_file_path}")
                except Exception as e:
                    print(f"증강 중 오류 발생: {file_path}, 오류: {e}")

print("모든 이미지 증강 완료 및 저장 완료.")
