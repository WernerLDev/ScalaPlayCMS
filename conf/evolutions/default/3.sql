# User schema

# --- !Ups

ALTER TABLE `documents`
ADD COLUMN `path` VARCHAR(255) NOT NULL AFTER `updated_at`;


# --- !Downs

ALTER TABLE `documents` 
DROP COLUMN `path`;
