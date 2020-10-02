/*
 Navicat MySQL Data Transfer

 Source Server         : mbk-mysql
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : localhost:3306
 Source Schema         : timeline-tx-db

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 03/10/2020 01:19:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for timeline_transaction
-- ----------------------------
DROP TABLE IF EXISTS `timeline_transaction`;
CREATE TABLE `timeline_transaction` (
  `timeline_timestamp` datetime DEFAULT NULL,
  `timeline_data` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `topic_id` int DEFAULT NULL,
  `topic_partition_id` int NOT NULL,
  `topic_partition_offset` bigint NOT NULL,
  PRIMARY KEY (`topic_partition_id`,`topic_partition_offset`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
