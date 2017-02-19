# User schema

# --- !Ups

CREATE TABLE `document` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `parent_id` INT NULL,
  `collapsed` TINYINT(1) NULL,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


# --- !Downs

drop table `document`