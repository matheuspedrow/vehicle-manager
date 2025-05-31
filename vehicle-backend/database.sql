-- Criar o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS vehicle_manager;

-- Usar o banco de dados
USE vehicle_manager;

-- Criar a tabela de veículos
CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(7) NOT NULL,
    chassi VARCHAR(17) NOT NULL,
    renavam VARCHAR(11) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    ano VARCHAR(4) NOT NULL,
    checkinDate DATETIME NOT NULL,
    checkoutDate DATETIME,
    UNIQUE KEY unique_placa (placa),
    UNIQUE KEY unique_chassi (chassi),
    UNIQUE KEY unique_renavam (renavam)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 