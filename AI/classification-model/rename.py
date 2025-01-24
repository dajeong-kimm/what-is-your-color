import os

def rename_folders_to_english(base_path, folder_mapping):
    for original_name, new_name in folder_mapping.items():
        original_folder = os.path.join(base_path, original_name)
        new_folder = os.path.join(base_path, new_name)

        # 폴더가 존재하는지 확인
        if os.path.exists(original_folder):
            try:
                os.rename(original_folder, new_folder)
                print(f"Renamed: {original_folder} -> {new_folder}")
            except Exception as e:
                print(f"Failed to rename {original_folder}: {e}")
        else:
            print(f"Folder does not exist: {original_folder}")

# 경로 및 폴더 매핑 설정
base_path = "C:/personal_color"
folder_mapping = {
    "가을_다크": "autumn_dark",
    "가을_뮤트": "autumn_muted",
    "가을_스트롱": "autumn_strong",
    "겨울_다크": "winter_dark",
    "겨울_비비드": "winter_vivid",
    "겨울_스트롱": "winter_strong",
    "봄_라이트": "spring_light",
    "봄_브라이트": "spring_bright",
    "봄_비비드": "spring_vivid",
    "여름_라이트": "summer_light",
    "여름_뮤트": "summer_muted",
    "여름_브라이트": "summer_bright"
}

# 폴더 이름 변경 실행
rename_folders_to_english(base_path, folder_mapping)
