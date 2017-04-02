# password reset schema

# --- !Ups

CREATE TABLE `resettokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `resettoken` VARCHAR(255) NULL,
  `expires_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));


# --- !Downs
drop table `resettokens`;