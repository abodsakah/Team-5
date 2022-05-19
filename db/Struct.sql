-- phpMyAdmin SQL Dump
-- version 4.6.6deb4+deb9u2
-- https://www.phpmyadmin.net/
--
-- Värd: localhost:3306
-- Tid vid skapande: 19 maj 2022 kl 12:30
-- Serverversion: 10.1.48-MariaDB-0+deb9u2
-- PHP-version: 7.0.33-0+deb9u11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `tract`
--
DROP DATABASE IF EXISTS `tract`;
CREATE DATABASE IF NOT EXISTS `tract` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tract`;

DELIMITER $$
--
-- Procedurer
--
DROP PROCEDURE IF EXISTS `add_node`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `add_node` (IN `n_uid` VARCHAR(255), IN `n_name` VARCHAR(255), IN `n_trigger_action` INT(11), IN `n_is_part_of` INT(11), IN `n_type` INT(11), IN `n_status` VARCHAR(255))  MODIFIES SQL DATA
BEGIN
INSERT INTO `logical_devices` (`id`, `uid`, `name`, `trigger_action`, `comp_id`, `install_date`, `is_part_of`, `type`, `status`) VALUES (NULL, `n_uid`, `n_name`, `n_trigger_action`, CURRENT_DATE(), `n_is_part_of`, `n_type`, `n_status`);
END$$

DROP PROCEDURE IF EXISTS `add_node_no_trigger_action`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `add_node_no_trigger_action` (IN `n_node_uid` VARCHAR(255), IN `n_node_name` VARCHAR(255), IN `n_is_part_of` INT, IN `n_node_type` INT, IN `n_node_status` VARCHAR(255))  begin
  INSERT INTO logical_devices (uid, name, trigger_action, install_date, is_part_of, type, status)
  VALUES (n_node_uid, n_node_name, 1, CURRENT_DATE(), n_is_part_of, n_node_type, n_node_status);
end$$

DROP PROCEDURE IF EXISTS `add_styling`$$
CREATE DEFINER=`abodsakka`@`localhost` PROCEDURE `add_styling` (IN `n_comp_id` INT, IN `n_color` VARCHAR(255), IN `n_logo` VARCHAR(255))  BEGIN
  INSERT INTO `website_settings` (`comp_id`, `color`, `logo`) VALUES (n_comp_id, n_color, n_logo);
END$$

DROP PROCEDURE IF EXISTS `add_test_logical_device_base`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `add_test_logical_device_base` ()  BEGIN
-- node thresholdINSERT INTO `node_thresholds` (`id`, `action`, `trigger_action`) VALUES (NULL, 'test action', 'test trigger action');
-- spaceINSERT INTO `spaces` (`id`, `type`, `name`, `agent`, `has_capability`, `is_part_of`)
VALUES (NULL, 'test', 'test space', '1', '123', NULL);
-- logical deviceINSERT INTO `logical_devices` (`id`, `uid`, `name`, `trigger_action`, `install_date`, `is_part_of`, `status`)
VALUES (NULL, '123456', 'test logical device', '1', CURRENT_DATE(), '1', 'ACTIVE');
END$$

DROP PROCEDURE IF EXISTS `add_to_log`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `add_to_log` (IN `n_msg` VARCHAR(255), IN `n_company_id` INT)  BEGIN
  INSERT INTO `company_log` (`msg`, `company_id`, `report_date`) VALUES (n_msg, n_company_id, NOW());
END$$

DROP PROCEDURE IF EXISTS `create_company`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `create_company` (IN `n_name` VARCHAR(255), IN `n_email` VARCHAR(255), IN `n_phone` VARCHAR(255))  BEGIN
  INSERT INTO `companies` (`name`, `support_email`, `support_phone`) VALUES (n_name, n_email, n_phone);
    SELECT LAST_INSERT_ID() AS id;
END$$

DROP PROCEDURE IF EXISTS `create_threshold`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `create_threshold` (IN `n_action` VARCHAR(10), IN `n_treshold` INT(255))  begin
  INSERT INTO node_thresholds (action, threshold) VALUES (n_action, n_treshold);
  -- select the id of the last inserted row  SELECT LAST_INSERT_ID() as id;
end$$

DROP PROCEDURE IF EXISTS `delete_logical_device_from_uid`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `delete_logical_device_from_uid` (IN `p_uid` INT)  NO SQL
DELETE FROM `logical_devices`
WHERE `logical_devices`.`uid` = p_uid$$

DROP PROCEDURE IF EXISTS `delete_node`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `delete_node` (IN `p_id` INT, IN `p_company_id` INT)  NO SQL
BEGIN
DELETE l
  FROM logical_devices l
  LEFT JOIN spaces s
  ON s.id = l.is_part_of
 WHERE l.id = p_id
 	AND s.agent = p_company_id
    AND l.status = "DELETED"
 ;
END$$

DROP PROCEDURE IF EXISTS `get_all_buildings`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_all_buildings` (IN `company_id` INT)  begin
  SELECT * FROM spaces WHERE is_part_of IS NULL AND agent = company_id;
end$$

DROP PROCEDURE IF EXISTS `get_amount_type_of_sensor`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_amount_type_of_sensor` (IN `n_sensor_type` VARCHAR(255), IN `n_company_id` INT)  BEGIN
  SELECT COUNT(*) AS amount FROM `logical_devices_all` WHERE `type_name` = n_sensor_type AND `company_id` = n_company_id;
END$$

DROP PROCEDURE IF EXISTS `get_assets_in_space`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_assets_in_space` (IN `space_id` INT)  BEGIN
  SELECT * FROM assets WHERE located_in = space_id;
END$$

DROP PROCEDURE IF EXISTS `get_asset_from_logical_device_id`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_asset_from_logical_device_id` (IN `p_id` INT(11))  NO SQL
BEGIN
  SELECT * FROM assets WHERE p_id = `hosts`;
END$$

DROP PROCEDURE IF EXISTS `get_company_log`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_company_log` (IN `p_company_id` INT(11))  NO SQL
BEGIN
  SELECT
  *
  FROM `company_log`
  WHERE `p_company_id` = company_id
  ORDER BY `id` DESC
  LIMIT 15;
END$$

DROP PROCEDURE IF EXISTS `get_company_settings`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_company_settings` (IN `company_id` INT)  BEGIN
    SELECT 
      *
    FROM `company_settings`;
END$$

DROP PROCEDURE IF EXISTS `get_logical_device_all`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_logical_device_all` (IN `p_id` INT(11), IN `p_company_id` INT(11))  NO SQL
BEGIN
SELECT *
FROM logical_devices_all
WHERE p_id=id AND p_company_id=company_id;
END$$

DROP PROCEDURE IF EXISTS `get_logical_device_status`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_logical_device_status` (IN `p_id` INT(11), IN `p_company_id` INT(11))  NO SQL
BEGIN
SELECT `status`
FROM `logical_devices_with_company_id`
WHERE p_id=id AND p_company_id=company_id;
END$$

DROP PROCEDURE IF EXISTS `get_logical_device_type`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_logical_device_type` (IN `p_id` INT(11), IN `p_company_id` INT(11))  NO SQL
BEGIN
SELECT type
FROM logical_devices_all
WHERE p_id=id AND p_company_id=company_id;
END$$

DROP PROCEDURE IF EXISTS `get_nodes_for_type`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_nodes_for_type` (IN `n_company_id` INT, IN `n_sensor_type` INT)  BEGIN
  SELECT * FROM `logical_devices_all` WHERE `type` = n_sensor_type AND `company_id` = n_company_id;
END$$

DROP PROCEDURE IF EXISTS `get_node_from_uid`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_node_from_uid` (IN `p_uid` VARCHAR(20) CHARSET utf8mb4)  NO SQL
    COMMENT 'get all logical_device info for a certain UID'
BEGIN
SELECT *
FROM logical_devices_all
WHERE p_uid=uid;
END$$

DROP PROCEDURE IF EXISTS `get_preloaded_node`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_preloaded_node` (IN `n_uid` INT(11), IN `n_company_id` INT)  NO SQL
SELECT * FROM node_preloaded WHERE uid = n_uid AND company_id = n_company_id$$

DROP PROCEDURE IF EXISTS `get_spaces_for_building`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_spaces_for_building` (IN `space_id` INT)  BEGIN
  SELECT * FROM spaces WHERE is_part_of = space_id;
END$$

DROP PROCEDURE IF EXISTS `get_space_from_id`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_space_from_id` (IN `p_id` INT)  NO SQL
BEGIN
  SELECT * FROM spaces WHERE id = p_id;
END$$

DROP PROCEDURE IF EXISTS `get_threshold`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_threshold` (IN `thresholdId` INT(11))  NO SQL
BEGIN
	SELECT * FROM node_thresholds WHERE id = thresholdId;
END$$

DROP PROCEDURE IF EXISTS `get_users_for_company`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `get_users_for_company` (IN `company_id` INT)  begin
  SELECT * FROM `user_login` WHERE `company_id` = company_id;
end$$

DROP PROCEDURE IF EXISTS `logical_devices_for_company`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `logical_devices_for_company` (IN `company_id` INT)  BEGIN
  SELECT * FROM `logical_devices_all` WHERE `company_id` = company_id;
END$$

DROP PROCEDURE IF EXISTS `reported_logical_devices_for_company`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `reported_logical_devices_for_company` (IN `company_id` INT)  NO SQL
BEGIN
  SELECT
  *
  FROM `logical_devices_all`
  WHERE `company_id` = company_id AND `status` = "REPORTED";
END$$

DROP PROCEDURE IF EXISTS `set_device_as_active`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `set_device_as_active` (IN `p_id` INT(11), IN `p_company_id` INT(11))  NO SQL
BEGIN
    UPDATE logical_devices l
    LEFT OUTER JOIN spaces s
    ON l.is_part_of = s.id
    SET l.status = "ACTIVE"
    WHERE l.id = p_id AND s.agent = p_company_id;
END$$

DROP PROCEDURE IF EXISTS `set_device_as_deleted`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `set_device_as_deleted` (IN `p_id` INT(11), IN `p_company_id` INT(11))  BEGIN
    UPDATE logical_devices l
    LEFT OUTER JOIN spaces s
    ON l.is_part_of = s.id
    SET l.status = "DELETED"
    WHERE l.id = p_id AND s.agent = p_company_id;
END$$

DROP PROCEDURE IF EXISTS `set_device_as_reported`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `set_device_as_reported` (IN `p_id` INT(11), IN `P_company_id` INT(11))  NO SQL
BEGIN
    UPDATE logical_devices l
    LEFT OUTER JOIN spaces s
    ON l.is_part_of = s.id
    SET l.status = "REPORTED"
    WHERE l.id = p_id AND s.agent = p_company_id;
END$$

DROP PROCEDURE IF EXISTS `set_device_to_be_deleted`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `set_device_to_be_deleted` (IN `p_id` INT(11), IN `p_company_id` INT(11))  NO SQL
BEGIN
    UPDATE logical_devices l
    LEFT OUTER JOIN spaces s
    ON l.is_part_of = s.id
    SET l.status = "TBD"
    WHERE l.id = p_id AND s.agent = p_company_id;
END$$

DROP PROCEDURE IF EXISTS `update_company_info`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `update_company_info` (IN `n_comp_id` INT, IN `n_name` VARCHAR(255), IN `n_email` VARCHAR(255), IN `n_phone` VARCHAR(255), IN `n_color` VARCHAR(255), IN `n_logo` VARCHAR(255))  BEGIN
  UPDATE `companies` SET `name` = n_name, `support_email` = n_email, `support_phone` = n_phone WHERE `id` = n_comp_id;
  UPDATE `website_settings` SET `color` = n_color, `logo` = n_logo WHERE `comp_id` = n_comp_id;
END$$

DROP PROCEDURE IF EXISTS `update_company_settings`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `update_company_settings` (IN `company_id` INT, IN `color` VARCHAR(255), IN `logo` VARCHAR(255))  BEGIN
    UPDATE `website_settings`
    SET `color` = color,
        `logo` = logo
    WHERE `comp_id` = company_id;
END$$

DROP PROCEDURE IF EXISTS `update_logical_device_threshold`$$
CREATE DEFINER=`abodsakka`@`localhost` PROCEDURE `update_logical_device_threshold` (IN `n_uid` INT, IN `n_threshold` INT)  BEGIN
  UPDATE `logical_devices` SET `trigger_action` = n_threshold WHERE uid = n_uid;
END$$

DROP PROCEDURE IF EXISTS `update_threshold`$$
CREATE DEFINER=`tractteam`@`%` PROCEDURE `update_threshold` (IN `n_id` INT, IN `n_action` VARCHAR(255), IN `n_value` INT)  BEGIN
  UPDATE `node_thresholds` SET `action` = n_action, `threshold` = n_value WHERE `id` = n_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellstruktur `acess`
--

DROP TABLE IF EXISTS `acess`;
CREATE TABLE `acess` (
  `node_id` int(11) NOT NULL,
  `comp_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `api_keys`
--

DROP TABLE IF EXISTS `api_keys`;
CREATE TABLE `api_keys` (
  `id` int(11) NOT NULL,
  `key` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `api_keys`
--

INSERT INTO `api_keys` (`id`, `key`) VALUES
(1, '377307b0-fdf6-4762-8403-00084d164de5');

-- --------------------------------------------------------

--
-- Tabellstruktur `assets`
--

DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `artic_num` varchar(255) NOT NULL,
  `located_in` int(11) NOT NULL,
  `hosts` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `assets`
--

INSERT INTO `assets` (`id`, `name`, `artic_num`, `located_in`, `hosts`) VALUES
(1, 'Chair 1', '1234567', 1, 16),
(3, 'Chair 2', '231242', 4, 42),
(16, 'test asset', '123123123', 2, 50),
(17, 'test-hiss', '0000000', 2, 77),
(18, 'test_asset', '123543', 3, NULL);

-- --------------------------------------------------------

--
-- Tabellstruktur `companies`
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `support_email` varchar(255) NOT NULL,
  `support_phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `companies`
--

INSERT INTO `companies` (`id`, `name`, `support_email`, `support_phone`) VALUES
(1, 'Tract', 'info@abodsakka.xyz', '0721282737'),
(24, 'Test old', 'test@new.com', '12345678'),
(25, 'Hello world', 'hello@world.com', '0232312312');

-- --------------------------------------------------------

--
-- Tabellstruktur `company_log`
--

DROP TABLE IF EXISTS `company_log`;
CREATE TABLE `company_log` (
  `id` int(11) NOT NULL,
  `report_date` varchar(255) NOT NULL,
  `msg` varchar(255) NOT NULL,
  `company_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `company_log`
--

INSERT INTO `company_log` (`id`, `report_date`, `msg`, `company_id`) VALUES
(2, '2022-05-10 19:13:30', 'Threshold 42 has been updated', 1),
(3, '2022-05-10 19:14:35', 'Threshold 142 has been updated', 1),
(4, '2022-05-11 14:37:51', 'Threshold 42 has been updated', 1),
(5, '2022-05-13 12:13:00', 'Threshold 42 has been updated', 1),
(6, '2022-05-14 19:20:19', 'Threshold 42 has been updated', 1),
(7, '2022-05-14 19:20:32', 'Company information and/or styling updated', 1),
(8, '2022-05-14 19:20:52', 'Company information and/or styling updated', 1),
(9, '2022-05-14 19:21:11', 'Company information and/or styling updated', 1),
(10, '2022-05-14 19:21:18', 'Company information and/or styling updated', 1),
(11, '2022-05-14 19:21:54', 'User 19 created', 25),
(38, '2022-05-16 07:00:13', 'Sensor 77 set to reported', 1),
(39, '2022-05-16 08:07:22', 'Sensor 77 workOrder has been resolved, sensor now set to active.', 1),
(40, '2022-05-16 08:41:29', 'Sensor 77 set to reported', 1),
(41, '2022-05-16 10:02:55', 'Sensor 16 set to reported', 1),
(42, '2022-05-16 10:11:17', 'Sensor 16 workOrder has been resolved, sensor now set to active.', 1),
(43, '2022-05-16 10:11:18', 'Sensor 16 workOrder has been resolved, sensor now set to active.', 1),
(44, '2022-05-16 10:11:22', 'Sensor 77 workOrder has been resolved, sensor now set to active.', 1),
(45, '2022-05-16 10:11:22', 'Sensor 77 workOrder has been resolved, sensor now set to active.', 1),
(46, '2022-05-16 11:13:22', 'Sensor 77 set to reported', 1),
(47, '2022-05-17 19:01:52', 'Sensor another_name added', 1),
(48, '2022-05-19 11:39:43', 'Sensor 16 set to reported', 1),
(49, '2022-05-19 11:39:43', 'Sensor 16 set to reported', 1),
(50, '2022-05-19 12:26:46', 'Sensor 50 set to deleted', 1);

-- --------------------------------------------------------

--
-- Ersättningsstruktur för vy `company_settings`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `company_settings`;
CREATE TABLE `company_settings` (
`color` varchar(255)
,`logo` varchar(255)
,`comp_id` int(11)
,`name` varchar(255)
);

-- --------------------------------------------------------

--
-- Ersättningsstruktur för vy `company_website_settings`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `company_website_settings`;
CREATE TABLE `company_website_settings` (
`id` int(11)
,`name` varchar(255)
,`support_email` varchar(255)
,`support_phone` varchar(255)
,`color` varchar(255)
,`logo` varchar(255)
);

-- --------------------------------------------------------

--
-- Tabellstruktur `logical_devices`
--

DROP TABLE IF EXISTS `logical_devices`;
CREATE TABLE `logical_devices` (
  `id` int(11) NOT NULL,
  `uid` varchar(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `trigger_action` int(11) NOT NULL,
  `install_date` varchar(255) NOT NULL,
  `is_part_of` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `logical_devices`
--

INSERT INTO `logical_devices` (`id`, `uid`, `name`, `trigger_action`, `install_date`, `is_part_of`, `type`, `status`) VALUES
(10, '123456', 'another_name', 1, '2022-05-17', 2, 2, 'DELETED'),
(16, '89390484BD', 'switch-sensor', 4, '2022-04-07', 1, 2, 'REPORTED'),
(42, 'ACB904843D', 'temp-sensor', 3, '2022-04-05', 4, 1, 'ACTIVE'),
(50, '88A904A4BD', 'test', 29, '2022-05-14', 1, 3, 'TBD'),
(77, 'ACB914A4BD', 'analog-wheel-sensor', 24, '2022-04-07', 2, 3, 'REPORTED');

-- --------------------------------------------------------

--
-- Ersättningsstruktur för vy `logical_devices_all`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `logical_devices_all`;
CREATE TABLE `logical_devices_all` (
`id` int(11)
,`uid` varchar(20)
,`name` varchar(255)
,`trigger_action` int(11)
,`install_date` varchar(255)
,`is_part_of` int(11)
,`type` int(11)
,`status` varchar(255)
,`company_id` int(11)
,`type_name` varchar(255)
,`app_settings` varchar(255)
);

-- --------------------------------------------------------

--
-- Ersättningsstruktur för vy `logical_devices_with_company_id`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `logical_devices_with_company_id`;
CREATE TABLE `logical_devices_with_company_id` (
`id` int(11)
,`uid` varchar(20)
,`name` varchar(255)
,`trigger_action` int(11)
,`install_date` varchar(255)
,`is_part_of` int(11)
,`type` int(11)
,`status` varchar(255)
,`company_id` int(11)
);

-- --------------------------------------------------------

--
-- Tabellstruktur `nc_evolutions`
--

DROP TABLE IF EXISTS `nc_evolutions`;
CREATE TABLE `nc_evolutions` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `titleDown` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `checksum` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `nc_evolutions`
--

INSERT INTO `nc_evolutions` (`id`, `title`, `titleDown`, `description`, `batch`, `checksum`, `status`, `created`, `created_at`, `updated_at`) VALUES
(1, '20220322_175512217.up.sql', '20220322_175512217.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(2, '20220322_175833961.up.sql', '20220322_175833961.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(3, '20220322_175903904.up.sql', '20220322_175903904.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(4, '20220322_175935474.up.sql', '20220322_175935474.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(5, '20220322_180201875.up.sql', '20220322_180201875.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(6, '20220322_180204770.up.sql', '20220322_180204770.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(7, '20220322_180603623.up.sql', '20220322_180603623.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(8, '20220322_181302277.up.sql', '20220322_181302277.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(9, '20220325_125825936.up.sql', '20220325_125825936.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(10, '20220325_125847174.up.sql', '20220325_125847174.down.sql', NULL, NULL, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellstruktur `node_preloaded`
--

DROP TABLE IF EXISTS `node_preloaded`;
CREATE TABLE `node_preloaded` (
  `uid` varchar(100) NOT NULL,
  `type` int(20) NOT NULL,
  `company_id` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `node_preloaded`
--

INSERT INTO `node_preloaded` (`uid`, `type`, `company_id`) VALUES
('123456', 2, 1),
('88A904A4BD', 3, 1),
('89390484BD', 2, 1),
('A83910B471', 2, 1),
('ACB904843D', 1, 1),
('ACB914A4BD', 3, 1);

-- --------------------------------------------------------

--
-- Tabellstruktur `node_thresholds`
--

DROP TABLE IF EXISTS `node_thresholds`;
CREATE TABLE `node_thresholds` (
  `id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `threshold` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `node_thresholds`
--

INSERT INTO `node_thresholds` (`id`, `action`, `threshold`) VALUES
(1, 'OVER', 1000),
(3, 'UNDER', 37),
(4, 'SAME', 0),
(21, 'UNDER', 0),
(22, 'SAME', 0),
(23, 'SAME', 2),
(24, 'UNDER', 5000),
(26, 'SAME', 5),
(27, 'DOWN', 100),
(28, 'SAME', 100),
(29, 'SAME', 100);

-- --------------------------------------------------------

--
-- Tabellstruktur `node_types`
--

DROP TABLE IF EXISTS `node_types`;
CREATE TABLE `node_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `app_settings` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `node_types`
--

INSERT INTO `node_types` (`id`, `name`, `app_settings`) VALUES
(1, 'temp-humidity', '020100504100000000000000000000000000000000000000'),
(2, 'switch', '0102005041000100000080004f0c0c0c0000000000000000'),
(3, 'analog-wheel', '010300504100010200000002010c0c0c0000000000000000');

-- --------------------------------------------------------

--
-- Tabellstruktur `shared_log`
--

DROP TABLE IF EXISTS `shared_log`;
CREATE TABLE `shared_log` (
  `id` int(11) NOT NULL,
  `prod_name` varchar(255) NOT NULL,
  `artic_num` varchar(255) NOT NULL,
  `reg_date` varchar(255) NOT NULL,
  `install_date` varchar(255) NOT NULL,
  `error_date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `spaces`
--

DROP TABLE IF EXISTS `spaces`;
CREATE TABLE `spaces` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `agent` int(11) NOT NULL,
  `has_capability` int(11) NOT NULL,
  `is_part_of` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `spaces`
--

INSERT INTO `spaces` (`id`, `type`, `name`, `agent`, `has_capability`, `is_part_of`) VALUES
(1, 'test', 'test space 1', 1, 123, NULL),
(2, 'test', 'test space 2', 1, 123, NULL),
(3, 'test', 'test space 3', 1, 123, NULL),
(4, 'allbinary', 'test', 1, 123, 2);

-- --------------------------------------------------------

--
-- Tabellstruktur `user_log`
--

DROP TABLE IF EXISTS `user_log`;
CREATE TABLE `user_log` (
  `id` int(11) NOT NULL,
  `from_device` int(11) DEFAULT NULL,
  `report_date` varchar(255) NOT NULL,
  `msg` varchar(255) NOT NULL,
  `priority` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `user_login`
--

DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `email_Verified` tinyint(1) NOT NULL,
  `role` int(11) NOT NULL,
  `company_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `user_login`
--

INSERT INTO `user_login` (`id`, `email`, `password`, `first_name`, `last_name`, `nickname`, `email_Verified`, `role`, `company_id`) VALUES
(1, 'abodsakka2001@gmail.com', '$2a$12$gFm.o6d8we7jugAYottmcOfZTFUJ5aE9qHgialKOtH1yBK99fC5HC', 'Abdulrahman', 'Sakah', 'abodsakka', 1, 0, 1),
(3, 'hloarab@gmail.com', '$2b$12$roLpC2B0FCur/o6t1mosOurbsxJ9nVJl8Hb1M3V5VjVfS82r9E3ai', 'abod', 'sakah', 'abodsakah', 0, 2, 3),
(4, 'info@abodsakka.xyz', '$2a$12$Xgnx3FpzmTxIg5LDm81zvO7WSdZwk/Z6LuplnNyGtGuyev6VCeM02', 'Tract', 'Builders', 'TractBuilders', 1, 0, 1),
(6, 'eeefwfwe@erpgre.com', '$2b$12$.KUyeoLNrkvlRM5XVIPHA.uCcI426VeUNQ03Nc4.8d2uiFIVW4dqy', 'pifwe', 'grergreg', 'egregerge', 0, 1, 4),
(7, 'efwfwef', '$2b$12$EPEYgAfVlbTbOPIkCOQQIuxs52bKp225R/1Uje9gKsXRnMnQpEwM6', 'efwefwefewf', 'ewfwefewfw', 'efwefwef', 0, 1, 5),
(8, 'ewfwfewf', '$2b$12$fjpZVjJPzjwGIfvw8HTtYOzDLFIT/LW668xaysxeYtgRHhB6ff24.', 'wefwefewf', 'ewfwefw', 'wffwefweflb', 0, 1, 6),
(9, 'admin@inc.com', '$2b$12$w5jMUPF.SAW045ybULVd8.Woy1799ibXJ76S0zOSMDcNlAf4/hMbe', 'big', 'boss', 'bigboss', 0, 1, 19),
(10, 'big.b@comp.com', '$2b$12$ao7j0P7zs0RHIk1BdNxO5ucx5oXGGaGvPwhhGchwNzpjSncU8drNO', 'big', 'boss', 'bigboss', 0, 1, 20),
(11, 'big.b@comp.com', '$2b$12$CylUW8HXA/PgWVA0NYA9d.xnEK5BXgFfFvtersTU..rXz1c2vmfTm', 'big', 'boss', 'bigboss', 0, 1, 21),
(12, 'big.b@comp.com', '$2b$12$RdJU/aCWaA1l..dLLN8YNeAJDFK7d.ry2JAd7Jx6bUny/InQeTrGK', 'big', 'boss', 'bigboss', 0, 1, 22),
(13, 'bog.b@comp.se', '$2b$12$z2fTrJ9m9J2rfIOgmfYLD.dUQGuxJdCBv1gIxs1S7PhvvTK6DMIK2', 'big', 'boss', 'bigboss', 0, 1, 23),
(14, 'big.m@inco.se', '$2b$12$gFIQ1M352rey517uIPdnr.bNS6FO66kH15Wspcw2PzOpKYs7DNy7m', 'big', 'boss man', 'big boss man', 0, 1, 24),
(19, 'abodsakka123123@13123.com', '$2b$12$tdYMf08qnrbrZJAS/TG37.zpUzEu/ld0gcJRNUXCUUsqf/TVBxZu2', 'Abod', 'Saka', 'abodsakka', 0, 1, 25),
(20, 'ewfwefew', '$2b$12$bONg6eEMp0t0RoypYye9fOrHsSn7sgXgGrVzElZop71OBHVMfUQEK', 'fefwef', 'fwefew', 'efef', 0, 1, 25),
(21, 'wefwef', '$2b$12$wBKpeEsCJN545OcCU/FkIu7jq5jfycIWPsFOD1o/8qPFfTxKTwova', 'fweef', 'ewfewf', 'wefewf', 0, 0, 24);

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  `company_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `users`
--

INSERT INTO `users` (`id`, `user_id`, `role`, `company_id`) VALUES
(2, '620523493dbc5d0068b2f2a9', 0, 1),
(3, '62069b4fcd0cab00711b040d', 2, 1);

-- --------------------------------------------------------

--
-- Tabellstruktur `website_settings`
--

DROP TABLE IF EXISTS `website_settings`;
CREATE TABLE `website_settings` (
  `comp_id` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `website_settings`
--

INSERT INTO `website_settings` (`comp_id`, `color`, `logo`) VALUES
(1, '6f7da5', 'Asset 1.png'),
(24, '7bb15d', 'ICA-logotyp.png'),
(25, '448bc9', 'tract_icon_1024.png');

-- --------------------------------------------------------

--
-- Struktur för vy `company_settings`
--
DROP TABLE IF EXISTS `company_settings`;

CREATE ALGORITHM=UNDEFINED DEFINER=`abodsakka`@`localhost` SQL SECURITY DEFINER VIEW `company_settings`  AS  select `ws`.`color` AS `color`,`ws`.`logo` AS `logo`,`ws`.`comp_id` AS `comp_id`,`c`.`name` AS `name` from (`website_settings` `ws` join `companies` `c` on((`ws`.`comp_id` = `c`.`id`))) ;

-- --------------------------------------------------------

--
-- Struktur för vy `company_website_settings`
--
DROP TABLE IF EXISTS `company_website_settings`;

CREATE ALGORITHM=UNDEFINED DEFINER=`abodsakka`@`localhost` SQL SECURITY DEFINER VIEW `company_website_settings`  AS  select `companies`.`id` AS `id`,`companies`.`name` AS `name`,`companies`.`support_email` AS `support_email`,`companies`.`support_phone` AS `support_phone`,`website_settings`.`color` AS `color`,`website_settings`.`logo` AS `logo` from (`companies` left join `website_settings` on((`companies`.`id` = `website_settings`.`comp_id`))) ;

-- --------------------------------------------------------

--
-- Struktur för vy `logical_devices_all`
--
DROP TABLE IF EXISTS `logical_devices_all`;

CREATE ALGORITHM=UNDEFINED DEFINER=`tractteam`@`%` SQL SECURITY DEFINER VIEW `logical_devices_all`  AS  select `l`.`id` AS `id`,`l`.`uid` AS `uid`,`l`.`name` AS `name`,`l`.`trigger_action` AS `trigger_action`,`l`.`install_date` AS `install_date`,`l`.`is_part_of` AS `is_part_of`,`l`.`type` AS `type`,`l`.`status` AS `status`,`s`.`agent` AS `company_id`,`t`.`name` AS `type_name`,`t`.`app_settings` AS `app_settings` from ((`logical_devices` `l` join `spaces` `s` on((`s`.`id` = `l`.`is_part_of`))) join `node_types` `t` on((`t`.`id` = `l`.`type`))) ;

-- --------------------------------------------------------

--
-- Struktur för vy `logical_devices_with_company_id`
--
DROP TABLE IF EXISTS `logical_devices_with_company_id`;

CREATE ALGORITHM=UNDEFINED DEFINER=`tractteam`@`%` SQL SECURITY DEFINER VIEW `logical_devices_with_company_id`  AS  select `l`.`id` AS `id`,`l`.`uid` AS `uid`,`l`.`name` AS `name`,`l`.`trigger_action` AS `trigger_action`,`l`.`install_date` AS `install_date`,`l`.`is_part_of` AS `is_part_of`,`l`.`type` AS `type`,`l`.`status` AS `status`,`s`.`agent` AS `company_id` from (`logical_devices` `l` join `spaces` `s` on((`s`.`id` = `l`.`is_part_of`))) ;

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `acess`
--
ALTER TABLE `acess`
  ADD PRIMARY KEY (`node_id`,`comp_id`,`user_id`),
  ADD KEY `comp_id` (`comp_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index för tabell `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `located_in` (`located_in`),
  ADD KEY `assets_ibfk_2` (`hosts`);

--
-- Index för tabell `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `company_log`
--
ALTER TABLE `company_log`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `logical_devices`
--
ALTER TABLE `logical_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`),
  ADD KEY `trigger_action` (`trigger_action`),
  ADD KEY `logical_devices_ibfk_2` (`is_part_of`),
  ADD KEY `logical_devices_ibfk_3` (`type`);

--
-- Index för tabell `nc_evolutions`
--
ALTER TABLE `nc_evolutions`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `node_preloaded`
--
ALTER TABLE `node_preloaded`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `node_preloaded_ibfk_1` (`type`);

--
-- Index för tabell `node_thresholds`
--
ALTER TABLE `node_thresholds`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `node_types`
--
ALTER TABLE `node_types`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `shared_log`
--
ALTER TABLE `shared_log`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `spaces`
--
ALTER TABLE `spaces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agent` (`agent`),
  ADD KEY `is_part_of` (`is_part_of`);

--
-- Index för tabell `user_log`
--
ALTER TABLE `user_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_device` (`from_device`);

--
-- Index för tabell `user_login`
--
ALTER TABLE `user_login`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Index för tabell `website_settings`
--
ALTER TABLE `website_settings`
  ADD PRIMARY KEY (`comp_id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `api_keys`
--
ALTER TABLE `api_keys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT för tabell `assets`
--
ALTER TABLE `assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT för tabell `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT för tabell `company_log`
--
ALTER TABLE `company_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT för tabell `logical_devices`
--
ALTER TABLE `logical_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;
--
-- AUTO_INCREMENT för tabell `nc_evolutions`
--
ALTER TABLE `nc_evolutions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT för tabell `node_thresholds`
--
ALTER TABLE `node_thresholds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT för tabell `node_types`
--
ALTER TABLE `node_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT för tabell `spaces`
--
ALTER TABLE `spaces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT för tabell `user_log`
--
ALTER TABLE `user_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT för tabell `user_login`
--
ALTER TABLE `user_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `acess`
--
ALTER TABLE `acess`
  ADD CONSTRAINT `acess_ibfk_1` FOREIGN KEY (`node_id`) REFERENCES `logical_devices` (`id`),
  ADD CONSTRAINT `acess_ibfk_2` FOREIGN KEY (`comp_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `acess_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Restriktioner för tabell `assets`
--
ALTER TABLE `assets`
  ADD CONSTRAINT `assets_ibfk_1` FOREIGN KEY (`located_in`) REFERENCES `spaces` (`id`),
  ADD CONSTRAINT `assets_ibfk_2` FOREIGN KEY (`hosts`) REFERENCES `logical_devices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restriktioner för tabell `logical_devices`
--
ALTER TABLE `logical_devices`
  ADD CONSTRAINT `logical_devices_ibfk_1` FOREIGN KEY (`trigger_action`) REFERENCES `node_thresholds` (`id`),
  ADD CONSTRAINT `logical_devices_ibfk_2` FOREIGN KEY (`is_part_of`) REFERENCES `spaces` (`id`),
  ADD CONSTRAINT `logical_devices_ibfk_3` FOREIGN KEY (`type`) REFERENCES `node_types` (`id`);

--
-- Restriktioner för tabell `node_preloaded`
--
ALTER TABLE `node_preloaded`
  ADD CONSTRAINT `node_preloaded_ibfk_1` FOREIGN KEY (`type`) REFERENCES `node_types` (`id`);

--
-- Restriktioner för tabell `spaces`
--
ALTER TABLE `spaces`
  ADD CONSTRAINT `spaces_ibfk_1` FOREIGN KEY (`agent`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `spaces_ibfk_2` FOREIGN KEY (`is_part_of`) REFERENCES `spaces` (`id`);

--
-- Restriktioner för tabell `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

--
-- Restriktioner för tabell `website_settings`
--
ALTER TABLE `website_settings`
  ADD CONSTRAINT `website_settings_ibfk_1` FOREIGN KEY (`comp_id`) REFERENCES `companies` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
