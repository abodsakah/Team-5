DROP DATABASE IF EXISTS tract;
CREATE DATABASE tract;

USE tract;

DROP TABLE IF EXISTS companies;
CREATE TABLE companies (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    support_email VARCHAR(255) NOT NULL,
    support_phone VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    role int NOT NULL,
    company_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS website_settings;
CREATE TABLE website_settings (
    comp_id int NOT NULL,
    color VARCHAR(255) NOT NULL,
    logo VARCHAR(255) NOT NULL,
    PRIMARY KEY (comp_id),
    FOREIGN KEY (comp_id) REFERENCES companies(id)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS node_thresholds;
CREATE TABLE node_thresholds (
    id INT NOT NULL AUTO_INCREMENT,
    action VARCHAR(255) NOT NULL,
    trigger_action VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

-- nodes
DROP TABLE IF EXISTS logical_devices;
CREATE TABLE logical_devices (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    trigger_action int NOT NULL,
    install_date VARCHAR(255) NOT NULL,
    is_part_of INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (trigger_action) REFERENCES node_thresholds(id)
) ENGINE = InnoDB;

-- use innodb engine
DROP TABLE IF EXISTS spaces;
CREATE TABLE spaces (
    id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    agent int NOT NULL,
    has_capability int NOT NULL,
    is_part_of int,
    PRIMARY KEY (id),
    FOREIGN KEY (agent) REFERENCES companies(id),
    FOREIGN KEY (is_part_of) REFERENCES spaces(id)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS assets;
CREATE TABLE assets (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    artic_num VARCHAR(255) NOT NULL,
    located_in INT NOT NULL,
    has_capability INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (located_in) REFERENCES spaces(id),
    FOREIGN KEY (has_capability) REFERENCES logical_devices(id)
) ENGINE = InnoDB;


DROP TABLE IF EXISTS acess;
CREATE TABLE acess (
    node_id INT NOT NULL,
    comp_id INT NOT NULL,
    user_id INT NOT NULL,
    grade INT NOT NULL,
    PRIMARY KEY (node_id, comp_id, user_id),
    FOREIGN KEY (node_id) REFERENCES logical_devices(id),
    FOREIGN KEY (comp_id) REFERENCES companies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS shared_log;
CREATE TABLE shared_log (
    prod_name VARCHAR(255) NOT NULL,
    artic_num VARCHAR(255) NOT NULL,
    reg_date VARCHAR(255) NOT NULL,
    install_date VARCHAR(255) NOT NULL,
    time_stamp VARCHAR(255) NOT NULL,
    PRIMARY KEY (artic_num)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS user_log;
CREATE TABLE user_log (
    id INT NOT NULL AUTO_INCREMENT,
    in_space INT NOT NULL,
    from_device INT,
    report_date VARCHAR(255) NOT NULL,
    msg VARCHAR(255) NOT NULL,
    priority INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (in_space) REFERENCES spaces(id),
    FOREIGN KEY (from_device) REFERENCES logical_devices(id)
) ENGINE = InnoDB;