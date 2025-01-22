import Augmentor

def augment_images(input_folder, output_folder, num_samples):
    """
    이미지 증강을 수행하고 결과를 저장합니다.

    Args:
        input_folder (str): 원본 이미지가 저장된 경로.
        output_folder (str): 증강 이미지가 저장될 경로.
        num_samples (int): 증강할 이미지 개수.
    """
    p = Augmentor.Pipeline(input_folder, output_directory=output_folder)
    p.rotate(probability=0.7, max_left_rotation=10, max_right_rotation=10)
    p.zoom_random(probability=0.5, percentage_area=0.9)
    p.flip_left_right(probability=0.5)
    p.random_brightness(probability=0.5, min_factor=0.7, max_factor=1.3)
    p.sample(num_samples)
    print(f"{num_samples}개의 증강 이미지가 {output_folder}에 저장되었습니다.")

if __name__ == "__main__":
    base_dir = "C:/Users/SSAFY/Desktop/퍼스널컬러"
    output_base_dir = "C:/Users/SSAFY/Desktop/augmented_data"
    num_samples_per_class = 300  # 각 클래스당 증강 이미지 개수

    categories = [
        "가을_다크", "가을_뮤트", "가을_스트롱",
        "겨울_다크", "겨울_비비드", "겨울_스트롱",
        "봄_라이트", "봄_브라이트", "봄_비비드",
        "여름_라이트", "여름_뮤트", "여름_브라이트"
    ]

    for category in categories:
        input_path = f"{base_dir}/{category}"
        output_path = f"{output_base_dir}/{category}"
        augment_images(input_path, output_path, num_samples_per_class)
