USE COP4331;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `DateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DateLastLoggedIn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FirstName` varchar(50) NOT NULL DEFAULT '',
  `LastName` varchar(50) NOT NULL DEFAULT '',
  `Login` varchar(50) NOT NULL DEFAULT '',
  `Password` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB;

INSERT INTO `Users` VALUES 
    (1,'2023-01-18 01:36:31','2023-01-18 01:36:31','Dillon','Flaschner','DRF','COP4331'),
    (2,'2023-01-18 01:37:26','2023-01-18 01:37:26','Rick','Leinecker','RickL','COP4331'),
    (3,'2023-01-18 23:19:32','2023-01-18 23:19:32','Testing','Register','Rick','7Fun'),
    (4,'2023-01-18 23:28:09','2023-01-18 23:28:09','Testing','Register2','Rick2','7Fun'),
    (10,'2023-01-19 00:17:01','2023-01-19 00:17:01','Curious','George','LeMonke','COP4331'),
    (11,'2023-01-19 00:18:04','2023-01-19 00:18:04','Curious','George','LeMonke2','COP4331'),
    (12,'2023-01-19 00:27:51','2023-01-19 00:27:51','Curious','George','LeMonke3','COP4331'),
    (13,'2023-01-23 23:06:11','2023-01-23 23:06:11','Bob','Bobbington','bb','supersecretpassword'),
    (24,'2023-01-29 00:22:59','2023-01-29 00:22:59','TEST','TEST','TEST','12345'),
    (25,'2023-01-30 00:42:52','2023-01-30 00:42:52','Jordan','Muniz','Drax','123456');

--
-- Table structure for table `Contacts`
--

DROP TABLE IF EXISTS `Contacts`;
CREATE TABLE `Contacts` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `Phone` varchar(50) NOT NULL DEFAULT '',
  `Email` varchar(50) NOT NULL DEFAULT '',
  `UserID` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  CONSTRAINT `fk_user` FOREIGN KEY (`UserID`) REFERENCES `Users`(`ID`)
) ENGINE=InnoDB;

INSERT INTO `Contacts` VALUES 
    (1,'John','123-456-7890','john@gmail.com',1),
    (2,'Thomas the Tank Engine','098-765-4321','traingofast@trains.edu',1),
    (3,'Thomas the Tank Engine','098-765-4321','traingofast@trains.edu',1),
    (5,'John','123-456-7890','john@gmail.com',1),
    (10,'Jane','123-456-7890','jane@gmail.com',2),
    (16,'Hackerman','111-222-1337','l33t4ack3r@mail.com',1),
    (18,'Test','123-456-7890','john@test.com',1);
