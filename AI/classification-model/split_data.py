import os
import shutil
from sklearn.model_selection import train_test_split

def split_data(input_folder, output_base_folder, test_size=0.2, validation_size=0.1):
    """
    데이터를 학습, 검증, 테스트로 분리합니다.

    Args:
        input_folder (str): 증강된 이미지 폴더 경로.
        output_base_folder (str): 분리된 데이터가 저장될 경로.
        test_size (float): 테스트 데이터 비율.
        validation_size (float): 검증 데이터 비율.
    """
    for category in os.listdir(input_folder):
        category_path = os.path.join(input_folder, category)
        if not os.path.isdir(category_path):
            continue

        # 모든 파일 가져오기
        files = [os.path.join(category_path, f) for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]

        # 학습, 테스트, 검증 데이터 분리
        train_files, test_files = train_test_split(files, test_size=test_size)
        train_files, val_files = train_test_split(train_files, test_size=validation_size / (1 - test_size))

        # 저장 경로 설정
        for split, split_files in zip(["train", "validation", "test"], [train_files, val_files, test_files]):
            split_dir = os.path.join(output_base_folder, split, category)
            os.makedirs(split_dir, exist_ok=True)
            for file in split_files:
                shutil.copy(file, split_dir)

if __name__ == "__main__":
    input_dir = "C:/Users/SSAFY/Desktop/augmented_data"
    output_dir = "C:/Users/SSAFY/Desktop/split_data"
    split_data(input_dir, output_dir)
