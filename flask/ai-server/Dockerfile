# 베이스 이미지
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일 복사
COPY requirements.txt requirements.txt
COPY app/ app/
COPY run.py run.py

# pip 최신화
RUN pip install --upgrade pip

# 종속성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir protobuf==3.20.3 && \
    pip install --no-cache-dir opencv-python-headless && \
    pip install --no-cache-dir mediapipe && \
    pip install --no-cache-dir -r requirements.txt


# 포트 설정
EXPOSE 5000

# Flask 애플리케이션 실행
CMD ["python", "run.py"]
