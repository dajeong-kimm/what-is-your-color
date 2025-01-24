## 유스케이스 다이어그램
![유스케이스 다이어그램](document/유스케이스 다이어그램.png)

## 아키텍처 구조도
![아키텍처 구조도](document/시스템아키텍처구조도.png)



---

# Git Flow & Commit Convention

## Git Flow Workflow

### 1. 브랜치 전략
프로젝트는 다음과 같은 브랜치로 관리됩니다:

- **`main`**: 배포 가능한 최종 코드. 항상 안정된 상태를 유지.
- **`develop`**: 개발 중인 코드. `feature` 브랜치가 머지되는 대상.
- **`feature/{기능명}`**: 새로운 기능 개발을 위한 브랜치. 작업 완료 후 `develop` 브랜치로 머지.
- **`hotfix/{수정명}`**: `main` 브랜치에서 발견된 긴급한 문제를 수정하기 위한 브랜치.
- **`release/{릴리즈명}`**: 배포를 준비하는 브랜치. 최종 QA 및 배포 전 작업 진행.
- **`bugfix/{버그명}`**: 버그 수정용 브랜치. 수정 후 `develop` 또는 `release` 브랜치에 머지.

### 2. 브랜치 생성 규칙
- **`feature` 브랜치**: `feature/{기능명}` (예: `feature/login-api`)
- **`hotfix` 브랜치**: `hotfix/{수정명}` (예: `hotfix/critical-bug`)
- **`release` 브랜치**: `release/{릴리즈명}` (예: `release/1.0.0`)
- **`bugfix` 브랜치**: `bugfix/{버그명}` (예: `bugfix/ui-overlap`)

### 3. 브랜치 작업 흐름
1. 새로운 작업이 시작되면, `develop` 브랜치에서 작업용 브랜치를 생성합니다.
2. 작업 완료 후, 해당 브랜치를 `develop`에 머지합니다.
3. QA 후 배포가 필요할 경우 `release` 브랜치를 생성하고 배포를 준비합니다.
4. `release` 브랜치에서 최종 수정 사항을 완료한 후, `main`에 머지하고 태그를 추가합니다.

---

## Commit Message Convention
### 1. 커밋 메시지 구조
```
<타입>: <제목>

본문 (선택 사항)
```

### 2. 타입(Type)
다음 타입을 사용해 커밋 메시지를 작성합니다:

- **`feat`**: 새로운 기능 추가
- **`fix`**: 버그 수정
- **`docs`**: 문서 수정
- **`style`**: 코드 스타일 변경 (포매팅, 세미콜론 추가 등)
- **`refactor`**: 코드 리팩토링 (기능 변화 없음)
- **`test`**: 테스트 코드 추가 또는 수정
- **`chore`**: 기타 변경 사항 (빌드 프로세스, 설정 파일 등)

### 3. 커밋 메시지 예시
```text
feat: 사용자 로그인 API 구현

- JWT를 사용하여 로그인 토큰 발급 기능 추가
- 로그인 실패 시 에러 메시지 반환

fix: 로그인 시 발생하던 NullPointerException 해결
```

---

# Project Development Environment

## Repository Structure
```
.
├── frontend/     # Frontend (React.js)
├── backend/      # Backend (Spring Boot, MySQL)
├── AI/           # AI-related models and services
├── document/     # Documentation and design files

```
