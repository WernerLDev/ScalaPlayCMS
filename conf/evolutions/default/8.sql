# asset schema

# --- !Ups

CREATE TABLE `asset` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parent_id` INT NULL,
  `name` VARCHAR(255) NULL,
  `mimetype` VARCHAR(255) NULL,
  `path` VARCHAR(255) NULL,
  `collapsed` VARCHAR(255) NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));


# --- !Downs
drop table `asset`;