CREATE DATABASE IF NOT EXISTS `info-sistemas`;
USE `info-sistemas`;

DROP TABLE IF EXISTS `veiculos`;

CREATE TABLE `veiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `placa` varchar(10) NOT NULL,
  `chassi` varchar(50) NOT NULL,
  `renavam` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `ano` int NOT NULL,
  `checkinDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `checkoutDate` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;