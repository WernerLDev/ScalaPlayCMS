
# User schema

# --- !Ups

ALTER TABLE `documents`
ADD COLUMN `view` VARCHAR(45) NULL AFTER `type`,
ADD COLUMN `published_at` DATETIME NULL DEFAULT NOW() AFTER `view`,
ADD COLUMN `created_at` DATETIME NULL DEFAULT NOW() AFTER `published_at`,
ADD COLUMN `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;


# --- !Downs

ALTER TABLE `documents` 
DROP COLUMN `updated_at`,
DROP COLUMN `created_at`,
DROP COLUMN `published_at`,
DROP COLUMN `view`;
