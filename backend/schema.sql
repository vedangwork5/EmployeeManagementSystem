CREATE DATABASE IF NOT EXISTS employee_system;

USE employee_system;

CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department VARCHAR(255),
  designation VARCHAR(255),
  salary DECIMAL(10, 2) DEFAULT 0,
  joining_date DATE,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_department (department),
  INDEX idx_designation (designation),
  INDEX idx_status (status)
);
