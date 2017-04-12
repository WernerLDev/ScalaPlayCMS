
# User schema

# --- !Ups

ALTER TABLE `documents`
ADD COLUMN `title` VARCHAR(255) NULL DEFAULT '',
ADD COLUMN `description` VARCHAR(160) NULL DEFAULT '',
ADD COLUMN `locale` VARCHAR(5) NULL DEFAULT 'en';

# --- !Downs

ALTER TABLE `documents` 
DROP COLUMN `title`,
DROP COLUMN `description`,
DROP COLUMN `locale`;
