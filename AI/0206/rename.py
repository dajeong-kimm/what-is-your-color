import os
import ctypes

# 한글 폴더명을 영어 폴더명으로 매핑
folder_name_mapping = {
    "봄_라이트": "spring_light",
    "봄_브라이트": "spring_bright",
    "봄_비비드": "spring_vivid",
    "여름_라이트": "summer_light",
    "여름_뮤트": "summer_muted",
    "여름_브라이트": "summer_bright",
    "가을_뮤트": "autumn_muted",
    "가을_스트롱": "autumn_strong",
    "가을_다크": "autumn_dark",
    "겨울_비비드": "winter_vivid",
    "겨울_스트롱": "winter_strong",
    "겨울_다크": "winter_dark"
}

# 권한 설정 함수
def grant_permissions(path):
    try:
        ctypes.windll.kernel32.SetFileAttributesW(path, 0x80)  # 읽기 전용 속성 제거
    except Exception as e:
        print(f"권한 설정 실패: {path}, 오류: {e}")

# 원본 폴더 경로
base_folder = r"C:\Users\SSAFY\Desktop\퍼스널컬러"

# 폴더 이름 변경
for old_name, new_name in folder_name_mapping.items():
    old_path = os.path.join(base_folder, old_name)
    new_path = os.path.join(base_folder, new_name)

    # 폴더가 존재하면 이름 변경
    if os.path.exists(old_path):
        try:
            grant_permissions(old_path)  # 권한 설정
            os.rename(old_path, new_path)
            print(f"폴더 이름 변경: {old_name} → {new_name}")
        except Exception as e:
            print(f"폴더 이름 변경 실패: {old_name} → {new_name}, 오류: {e}")
