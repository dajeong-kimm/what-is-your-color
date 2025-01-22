-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS ssafy_web_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- 데이터베이스 사용
USE ssafy_web_db;

-- 사용자 테이블 생성
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 회의 카테고리 테이블 생성
CREATE TABLE conference_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 회의 테이블 생성
CREATE TABLE conference (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    conference_category INT NOT NULL,
    call_start_time DATETIME NOT NULL,
    call_end_time DATETIME NOT NULL,
    thumbnail_url VARCHAR(255),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (conference_category) REFERENCES conference_category(id)
);

-- 사용자-회의 관계 테이블 생성
CREATE TABLE user_conference (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (conference_id) REFERENCES conference(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 회의 이력 테이블 생성
CREATE TABLE conference_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    user_id INT NOT NULL,
    action SMALLINT NOT NULL,
    inserted_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES conference(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
