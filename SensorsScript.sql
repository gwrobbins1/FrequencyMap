-- MySQL Script generated by MySQL Workbench
-- 04/07/17 03:02:33
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Recorded_Data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Recorded_Data` (
  `Index` INT NOT NULL AUTO_INCREMENT,
  `TIME` DATETIME NULL,
  `Completed` TINYINT(1) NOT NULL,
  `Frequency` DOUBLE NULL,
  `Readings` DOUBLE NULL,
  PRIMARY KEY (`Index`),
  UNIQUE INDEX `Index_UNIQUE` (`Index` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Sensors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Sensors` (
  `SID` INT NOT NULL,
  `Latitude` DOUBLE NULL,
  `Longitude` DOUBLE NULL,
  PRIMARY KEY (`SID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Live`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Live` (
  `Index` INT NOT NULL AUTO_INCREMENT,
  `TIME` DATETIME NULL,
  `Completed` TINYINT(1) NOT NULL,
  `Frequency` DOUBLE NULL,
  `Readings` DOUBLE NULL,
  PRIMARY KEY (`Index`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Sensors_has_Live`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Sensors_has_Live` (
  `Sensors_SID` INT NOT NULL,
  `Live_Index` INT NOT NULL,
  PRIMARY KEY (`Sensors_SID`, `Live_Index`),
  INDEX `fk_Sensors_has_Live_Live1_idx` (`Live_Index` ASC),
  INDEX `fk_Sensors_has_Live_Sensors1_idx` (`Sensors_SID` ASC),
  CONSTRAINT `fk_Sensors_has_Live_Sensors1`
    FOREIGN KEY (`Sensors_SID`)
    REFERENCES `mydb`.`Sensors` (`SID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Sensors_has_Live_Live1`
    FOREIGN KEY (`Live_Index`)
    REFERENCES `mydb`.`Live` (`Index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Sensors_has_Recorded_Data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Sensors_has_Recorded_Data` (
  `Sensors_SID` INT NOT NULL,
  `Recorded_Data_Index` INT NOT NULL,
  PRIMARY KEY (`Sensors_SID`, `Recorded_Data_Index`),
  INDEX `fk_Sensors_has_Recorded_Data_Recorded_Data1_idx` (`Recorded_Data_Index` ASC),
  INDEX `fk_Sensors_has_Recorded_Data_Sensors1_idx` (`Sensors_SID` ASC),
  CONSTRAINT `fk_Sensors_has_Recorded_Data_Sensors1`
    FOREIGN KEY (`Sensors_SID`)
    REFERENCES `mydb`.`Sensors` (`SID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Sensors_has_Recorded_Data_Recorded_Data1`
    FOREIGN KEY (`Recorded_Data_Index`)
    REFERENCES `mydb`.`Recorded_Data` (`Index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;