# User schema

# --- !Ups

CREATE TABLE `editables` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `document_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `value` TEXT NULL,
  PRIMARY KEY (`id`));

# --- !Downs
drop table `editables`;