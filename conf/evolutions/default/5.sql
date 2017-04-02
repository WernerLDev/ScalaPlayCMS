# User schema

# --- !Ups

ALTER TABLE `users` 
CHANGE COLUMN `password` `passwordhash` VARCHAR(255) NULL DEFAULT NULL ;


# --- !Downs
ALTER TABLE `users` 
CHANGE COLUMN `passwordhash` `password` VARCHAR(255) NULL DEFAULT NULL ;
