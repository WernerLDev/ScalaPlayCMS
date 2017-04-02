# asset schema

# --- !Ups

CREATE TABLE `assets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parent_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `mimetype` VARCHAR(255) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `server_path` VARCHAR(255) NOT NULL,
  `collapsed` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));


# --- !Downs
drop table `assets`;