# User schema

# --- !Ups

CREATE TABLE `sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `session_key` VARCHAR(45) NULL,
  `user_id` INT NULL,
  `ipaddress` VARCHAR(45) NULL,
  `useragent` VARCHAR(255) NULL,
  `passwordhash` VARCHAR(255) NULL,
  `expiration_date` DATETIME NULL,
  UNIQUE INDEX `session_key_UNIQUE` (`session_key` ASC),
  PRIMARY KEY (`id`));


# --- !Downs
drop table `sessions`;