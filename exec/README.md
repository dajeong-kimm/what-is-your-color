# 포팅 매뉴얼

## 1. GitLab 소스 클론 이후 빌드 및 배포 절차

본 문서는 GitLab에서 소스를 클론한 후, 빌드 및 배포할 수 있도록 정리한 가이드입니다.

### 1.1 사용 기술 및 환경

- **JVM 버전:** OpenJDK 17
- **웹서버:** Nginx 1.20.1
- **WAS:** Spring Boot 3.3.6 (Embedded Tomcat)
- **IDE:** IntelliJ IDEA 2024.3.1. 또는 VS Code

### 1.2 빌드 시 사용되는 환경 변수

```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:mysql://localhost:3306/personal_color_db
DATABASE_USER=ssafy
DATABASE_PASSWORD=ssafyssafy
OPENAI_API_KEY=${your_key}

```

### 1.3 배포 시 특이사항

- `docker-compose.yml`을 활용하여 백엔드 및 프론트엔드 컨테이너 실행
- SSL 적용 시, `/etc/nginx/ssl` 경로에 인증서 배치 필요
- 배포 후 `systemctl restart nginx` 실행하여 설정 반영

### 1.4 프로젝트 주요 계정 및 프로퍼티 정의 파일 목록

- `application.properties`
- `.env` → 외부 API 키 및 환경 변수 저장
- `docker-compose.yml` → 컨테이너 설정 파일

---

## 2. 프로젝트에서 사용하는 외부 서비스 정보

프로젝트에서는 다음과 같은 외부 서비스를 활용합니다. 가입 및 설정 방법을 문서화합니다.

### 2.1 OpenAI API (맞춤형 컨설팅 활용)

- OpenAI 계정 생성 후, API 키 발급 (`OPENAI_API_KEY` 환경 변수 설정 필요)

---

## 3. DB 덤프 파일 최종

- 테이블 목록: `personal_color`, `products`, `product_color`, `product_personal`, `personal_color_hashtags`, `best_color`, `worst_color` 등
- /document 폴더 내에 init.sql과 init_data.sql을 순차적으로 실행

---

## 4. 시연 시나리오

본 프로젝트의 시연은 다음과 같은 흐름으로 진행됩니다.

### 4.1 시연 흐름

1. ***화면 보호기 작동***
2. **퍼스널 컬러 진단**
    - AI 기반 분석 또는 LAB 색상 거리 분석 선택
    - 결과를 확인 후 QR 또는 이메일로 전송 가능
3. **메이크업 시뮬레이션**
    - 추천된 립, 치크, 아이섀도우 적용
    - 필터 조절 및 원본/효과 비교 가능
4. **AI 기반 맞춤형 추천**
    - OpenAI API 활용하여 패션 및 향수 추천 제공
5. **사진 촬영 및 공유**
    - 계절네컷 기능 활용하여 사진 촬영
    - QR 코드 또는 이메일로 공유 및 즉석 인쇄 가능

### 4.2 화면별 상세 설명

- **메인 화면:** 서비스 개요 및 진단 시작 버튼
- **퍼스널 컬러 진단 화면:** 분석 방식 선택 및 결과 확인
- **메이크업 시뮬레이션 화면:** 다양한 색조 화장품 적용 및 조절
- **AI 추천 화면:** 패션 및 향수 추천 결과 제공
- **사진 촬영 화면:** 필터 적용 후 사진 촬영 및 다운로드

---

위 매뉴얼을 따라 프로젝트의 배포, 실행 및 시연을 원활하게 진행할 수 있습니다.