
# Code generated schema

# --- !Ups

CREATE TABLE `entities` ( 
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `entityName` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);



# --- !Downs
DROP TABLE `entities`;
