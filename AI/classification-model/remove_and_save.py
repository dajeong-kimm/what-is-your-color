import os
from PIL import Image
import cv2
import numpy as np
import imghdr

def remove_background_and_save(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for root, dirs, files in os.walk(input_folder):
        relative_path = os.path.relpath(root, input_folder)
        current_output_folder = os.path.join(output_folder, relative_path)

        if not os.path.exists(current_output_folder):
            os.makedirs(current_output_folder)

        for file_name in files:
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                input_file_path = os.path.join(root, file_name)
                output_file_path = os.path.join(current_output_folder, file_name)

                # 파일 형식 확인
                if not validate_image(input_file_path):
                    continue

                # 이미지 읽기 (Pillow 사용)
                image = read_image_with_pillow(input_file_path)
                if image is None:
                    print(f"Could not process image: {input_file_path}")
                    continue

                # Face Detection 로직은 여기에 추가
                # 현재는 단순히 이미지를 저장하는 작업만 포함
                cv2.imwrite(output_file_path, image)
                print(f"Processed and saved: {output_file_path}")

def read_image_with_pillow(file_path):
    try:
        pil_image = Image.open(file_path).convert("RGBA")
        return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGBA2BGRA)
    except Exception as e:
        print(f"Could not read image with Pillow: {file_path}")
        print(e)
        return None

def validate_image(file_path):
    image_type = imghdr.what(file_path)
    if image_type not in ['png']:
        print(f"Invalid image type: {file_path} ({image_type})")
        return False
    return True

# 실행
input_folder = "C:/Users/SSAFY/Desktop/퍼스널컬러"
output_folder = "C:/Users/SSAFY/Desktop/removed"
remove_background_and_save(input_folder, output_folder)
