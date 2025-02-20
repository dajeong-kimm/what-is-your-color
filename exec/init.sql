-- Database initialization script for personal color and products

-- Create database
DROP DATABASE IF EXISTS personal_color_db;
CREATE DATABASE IF NOT EXISTS personal_color_db;
USE personal_color_db;

-- Create 'personal_color' table
CREATE TABLE personal_color (
    personal_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    english_name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create 'products' table
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    product_detail_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    image TEXT NOT NULL
);

-- Create 'product_color' table
CREATE TABLE product_color (
    product_id INT,
    color VARCHAR(7) NOT NULL,
    PRIMARY KEY (product_id, color),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Create 'product_personal' table
CREATE TABLE product_personal (
    product_id INT,
    personal_id INT,
    PRIMARY KEY (product_id, personal_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (personal_id) REFERENCES personal_color(personal_id) ON DELETE CASCADE
);

-- Create 'personal_color_hashtags' table
CREATE TABLE personal_color_hashtags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personal_id INT,
    hashtag VARCHAR(255) NOT NULL,
    FOREIGN KEY (personal_id) REFERENCES personal_color(personal_id) ON DELETE CASCADE
);

-- Create 'personal_color_fashion' table
CREATE TABLE personal_color_fashion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personal_id INT,
    color_id INT,
    color VARCHAR(7) NOT NULL,
    FOREIGN KEY (personal_id) REFERENCES personal_color(personal_id) ON DELETE CASCADE
);

-- Create 'personal_color_lip' table
CREATE TABLE personal_color_lip (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personal_id INT,
    color_id INT,
    color VARCHAR(7) NOT NULL,
    FOREIGN KEY (personal_id) REFERENCES personal_color(personal_id) ON DELETE CASCADE
);

-- Create 'personal_color_chic' table
CREATE TABLE personal_color_chic (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personal_id INT,
    color_id INT,
    color VARCHAR(7) NOT NULL,
    FOREIGN KEY (personal_id) REFERENCES personal_color(personal_id) ON DELETE CASCADE
);

-- Create 'personal_color_eye' table
CREATE TABLE personal_color_eye (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personal_id INT,
    color_id INT,
    color VARCHAR(7) NOT NULL,
    FOREIGN KEY (personal_id) REFERENCES personal_color(personal_id) ON DELETE CASCADE
);

-- Create 'best_color' table
CREATE TABLE best_color (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personal_id INT,
    color VARCHAR(7) NOT NULL,
    name VARCHAR(255),
    FOREIGN KEY (personal_id) REFERENCES personal_color(personal_id) ON DELETE CASCADE
);

-- Create 'worst_color' table
CREATE TABLE worst_color (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personal_id INT,
    color VARCHAR(7) NOT NULL,
    name VARCHAR(255),
    FOREIGN KEY (personal_id) REFERENCES personal_color(personal_id) ON DELETE CASCADE
);
