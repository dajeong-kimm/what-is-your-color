# 1️⃣ Node.js 기반 빌드 단계
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 2️⃣ Nginx를 사용한 정적 파일 제공
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
