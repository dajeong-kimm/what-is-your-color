# 1️⃣ Node.js 기반 빌드 단계
FROM node:18 AS build

WORKDIR /app

# 최신 npm 버전 설치 (npm 버그 방지)
RUN npm install -g npm@latest

# package.json과 package-lock.json을 먼저 복사하여 의존성 캐싱 최적화
COPY package.json package-lock.json ./

# npm 최신 버전으로 의존성 설치
RUN npm ci --legacy-peer-deps

# 나머지 소스 코드 복사
COPY . .

# Vite 빌드 실행
RUN npm run build

# 2️⃣ Nginx를 사용한 정적 파일 제공
FROM nginx:alpine

# 빌드된 정적 파일을 Nginx 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
