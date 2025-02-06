# 베이스 이미지 설정
FROM python:3.9-slim

# 환경 변수 설정
ENV PYTHONUNBUFFERED=1

# 작업 디렉토리 설정
WORKDIR /app

# 필수 패키지 설치 (libGL.so.1 문제 해결)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 필요한 파일 복사
COPY requirements.txt . 
COPY app/ app/ 
COPY run.py . 

# pip 최신화 및 패키지 설치
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Flask 서버가 실행될 포트
EXPOSE 5000

# Flask 애플리케이션 실행
CMD ["python", "run.py"]
