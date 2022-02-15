-- Database dump
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

-- --------------------------------------------------------

--
-- Tabellstruktur `acess`
--

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

CREATE TABLE `assets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `artic_num` varchar(255) NOT NULL,
  `located_in` int(11) NOT NULL,
  `has_capability` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `companies`
--

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
(1, 'Tract', 'info@abodsakka.xyz', '0721282737');

-- --------------------------------------------------------

--
-- Tabellstruktur `logical_devices`
--

CREATE TABLE `logical_devices` (
  `id` int(11) NOT NULL,
  `uid` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `trigger_action` int(11) NOT NULL,
  `install_date` varchar(255) NOT NULL,
  `is_part_of` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `node_thresholds`
--

CREATE TABLE `node_thresholds` (
  `id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `trigger_action` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `shared_log`
--

CREATE TABLE `shared_log` (
  `id` int(11) NOT NULL,
  `prod_name` varchar(255) NOT NULL,
  `artic_num` varchar(255) NOT NULL,
  `reg_date` varchar(255) NOT NULL,
  `install_date` varchar(255) NOT NULL,
  `time_stamp` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `spaces`
--

CREATE TABLE `spaces` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `agent` int(11) NOT NULL,
  `has_capability` int(11) NOT NULL,
  `is_part_of` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `user_log`
--

CREATE TABLE `user_log` (
  `id` int(11) NOT NULL,
  `in_space` int(11) NOT NULL,
  `from_device` int(11) DEFAULT NULL,
  `report_date` varchar(255) NOT NULL,
  `msg` varchar(255) NOT NULL,
  `priority` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

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

CREATE TABLE `website_settings` (
  `comp_id` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  ADD KEY `has_capability` (`has_capability`);

--
-- Index för tabell `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `logical_devices`
--
ALTER TABLE `logical_devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trigger_action` (`trigger_action`);

--
-- Index för tabell `node_thresholds`
--
ALTER TABLE `node_thresholds`
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
  ADD KEY `in_space` (`in_space`),
  ADD KEY `from_device` (`from_device`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT för tabell `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT för tabell `logical_devices`
--
ALTER TABLE `logical_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT för tabell `node_thresholds`
--
ALTER TABLE `node_thresholds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT för tabell `spaces`
--
ALTER TABLE `spaces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT för tabell `user_log`
--
ALTER TABLE `user_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
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
  ADD CONSTRAINT `assets_ibfk_2` FOREIGN KEY (`has_capability`) REFERENCES `logical_devices` (`id`);

--
-- Restriktioner för tabell `logical_devices`
--
ALTER TABLE `logical_devices`
  ADD CONSTRAINT `logical_devices_ibfk_1` FOREIGN KEY (`trigger_action`) REFERENCES `node_thresholds` (`id`);

--
-- Restriktioner för tabell `spaces`
--
ALTER TABLE `spaces`
  ADD CONSTRAINT `spaces_ibfk_1` FOREIGN KEY (`agent`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `spaces_ibfk_2` FOREIGN KEY (`is_part_of`) REFERENCES `spaces` (`id`);

--
-- Restriktioner för tabell `user_log`
--
ALTER TABLE `user_log`
  ADD CONSTRAINT `user_log_ibfk_1` FOREIGN KEY (`in_space`) REFERENCES `spaces` (`id`),
  ADD CONSTRAINT `user_log_ibfk_2` FOREIGN KEY (`from_device`) REFERENCES `logical_devices` (`id`);

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
