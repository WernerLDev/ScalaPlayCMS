# User schema

# --- !Ups

ALTER TABLE `User` 
CHANGE COLUMN `password` `passwordhash` VARCHAR(255) NULL DEFAULT NULL ;


# --- !Downs
ALTER TABLE `User` 
CHANGE COLUMN `passwordhash` `password` VARCHAR(255) NULL DEFAULT NULL ;
