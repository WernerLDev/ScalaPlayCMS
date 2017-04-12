# User schema

# --- !Ups

ALTER TABLE `assets`
ADD COLUMN `filesize` INT NULL DEFAULT 0

# --- !Downs

ALTER TABLE `assets` 
DROP COLUMN `filesize`
