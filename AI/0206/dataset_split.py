import os
import shutil
import random

# 원본 데이터 경로 및 분류된 데이터 저장 경로
source_folder = r"C:\Users\SSAFY\Desktop\augmented"  # 원본 데이터 폴더
output_folder = r"C:\Users\SSAFY\Desktop\dataset_split"  # 분류된 데이터 저장 폴더

# 데이터 분할 비율
train_ratio = 0.8
val_ratio = 0.1
test_ratio = 0.1

# 분류된 폴더 경로 생성
train_folder = os.path.join(output_folder, "train")
val_folder = os.path.join(output_folder, "val")
test_folder = os.path.join(output_folder, "test")

os.makedirs(train_folder, exist_ok=True)
os.makedirs(val_folder, exist_ok=True)
os.makedirs(test_folder, exist_ok=True)

# 각 카테고리에 대해 데이터 분류
categories = os.listdir(source_folder)
for category in categories:
    category_path = os.path.join(source_folder, category)
    if os.path.isdir(category_path):
        # 카테고리별 데이터 파일 리스트
        files = os.listdir(category_path)
        random.shuffle(files)  # 파일 랜덤 셔플

        # 분할 인덱스 계산
        total_files = len(files)
        train_end = int(total_files * train_ratio)
        val_end = train_end + int(total_files * val_ratio)

        # 학습, 검증, 테스트 데이터 분리
        train_files = files[:train_end]
        val_files = files[train_end:val_end]
        test_files = files[val_end:]

        # 카테고리별 폴더 생성 및 파일 이동
        for dataset, dataset_files in zip(
            [train_folder, val_folder, test_folder],
            [train_files, val_files, test_files],
        ):
            dataset_category_folder = os.path.join(dataset, category)
            os.makedirs(dataset_category_folder, exist_ok=True)
            for file_name in dataset_files:
                src_path = os.path.join(category_path, file_name)
                dest_path = os.path.join(dataset_category_folder, file_name)
                shutil.copy(src_path, dest_path)  # 파일 복사

print("데이터 분류 완료!")
