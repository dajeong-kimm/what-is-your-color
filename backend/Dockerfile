# 1. 베이스 이미지 선택 (JDK 17, Gradle 포함)
FROM gradle:8.4-jdk17 AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 프로젝트 파일 복사 (backend/yourcolors만 복사)
COPY yourcolors/ ./yourcolors/

# 4. 빌드 실행 (yourcolors 디렉토리에서 실행)
WORKDIR /app/yourcolors
RUN gradle build --no-daemon -x test

# 5. 런타임 환경을 위한 JDK 이미지 사용
FROM openjdk:17-jdk-slim

# 6. 환경 변수 설정
ENV APP_NAME=yourcolors
ENV APP_VERSION=1.0.0

# 7. 작업 디렉토리 설정
WORKDIR /app

# 8. 빌드된 JAR 파일을 복사
COPY --from=builder /app/yourcolors/build/libs/*.jar app.jar

# 9. 컨테이너에서 실행될 명령어 지정
CMD ["java", "-jar", "app.jar"]
