-- Database initialization script for personal color and products

-- Create database
CREATE DATABASE IF NOT EXISTS personal_color_db;
USE personal_color_db;

-- Create 'personal_color' table
CREATE TABLE personal_color (
    personal_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create 'products' table
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    product_detail_name VARCHAR(255) NOT NULL,
    price INT NOT NULL
);

-- Create 'product_color' table
CREATE TABLE product_color (
    product_id INT,
    color VARCHAR(7) NOT NULL,
    r INT NOT NULL,
    g INT NOT NULL,
    b INT NOT NULL,
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