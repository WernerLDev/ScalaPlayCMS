# User schema

# --- !Ups

ALTER TABLE `document`
ADD COLUMN `path` VARCHAR(255) NOT NULL AFTER `updated_at`;


# --- !Downs

ALTER TABLE `document` 
DROP COLUMN `path`;
