CREATE DATABASE IF NOT EXISTS `info-sistemas`;
USE `info-sistemas`;

CREATE TABLE IF NOT EXISTS `veiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `placa` varchar(10) NOT NULL,
  `chassi` varchar(50) NOT NULL,
  `renavam` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `ano` int NOT NULL,
  PRIMARY KEY (`id`)
); 