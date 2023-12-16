-- MySQL dump 10.13  Distrib 8.1.0, for macos13 (x86_64)
--
-- Host: 127.0.0.1    Database: MovieRecap
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actor_to_film`
--

DROP TABLE IF EXISTS `actor_to_film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actor_to_film` (
  `film_id` int DEFAULT NULL,
  `character_name` varchar(255) DEFAULT NULL,
  `actor_id` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `actor_to_film_actors_id_fk` (`actor_id`),
  KEY `actor_to_film_movies_id_fk` (`film_id`),
  CONSTRAINT `actor_to_film_actors_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `actors` (`id`),
  CONSTRAINT `actor_to_film_movies_id_fk` FOREIGN KEY (`film_id`) REFERENCES `movies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=589816 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `actors`
--

DROP TABLE IF EXISTS `actors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `actor_name` varchar(255) DEFAULT NULL,
  `profile_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_actor_name` (`actor_name`)
) ENGINE=InnoDB AUTO_INCREMENT=262141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `director_to_film`
--

DROP TABLE IF EXISTS `director_to_film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `director_to_film` (
  `film_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `director_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `director_to_film_directors_id_fk` (`director_id`),
  KEY `director_to_film_movies_id_fk` (`film_id`),
  CONSTRAINT `director_to_film_directors_id_fk` FOREIGN KEY (`director_id`) REFERENCES `directors` (`id`),
  CONSTRAINT `director_to_film_movies_id_fk` FOREIGN KEY (`film_id`) REFERENCES `movies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65536 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `directors`
--

DROP TABLE IF EXISTS `directors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `directors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `director_name` varchar(255) DEFAULT NULL,
  `profile_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_director_name` (`director_name`)
) ENGINE=InnoDB AUTO_INCREMENT=32768 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `overview` text,
  `tagline` text,
  `original_language` text,
  `release_date` date DEFAULT NULL,
  `revenue` int DEFAULT NULL,
  `poster_path` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `movies_title_index` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=469173 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `film_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `comments` varchar(1000) DEFAULT NULL,
  `Action` double DEFAULT NULL,
  `Adventure` double DEFAULT NULL,
  `Animation` double DEFAULT NULL,
  `Comedy` double DEFAULT NULL,
  `Crime` double DEFAULT NULL,
  `Drama` double DEFAULT NULL,
  `Fantasy` double DEFAULT NULL,
  `Family` double DEFAULT NULL,
  `Fiction` double DEFAULT NULL,
  `International` double DEFAULT NULL,
  `Horror` double DEFAULT NULL,
  `Mystery` double DEFAULT NULL,
  `Romance` double DEFAULT NULL,
  `SciFi` double DEFAULT NULL,
  `Thriller` double DEFAULT NULL,
  `TeleFilm` double DEFAULT NULL,
  `Documentary` double DEFAULT NULL,
  `History` double DEFAULT NULL,
  `Music` double DEFAULT NULL,
  `War` double DEFAULT NULL,
  `Western` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_film` (`user_id`,`film_id`),
  KEY `reviews_movies_id_fk` (`film_id`),
  CONSTRAINT `reviews_movies_id_fk` FOREIGN KEY (`film_id`) REFERENCES `movies` (`id`),
  CONSTRAINT `reviews_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reviews_base`
--

DROP TABLE IF EXISTS `reviews_base`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews_base` (
  `id` int NOT NULL AUTO_INCREMENT,
  `film_id` int NOT NULL,
  `vote_count` int NOT NULL,
  `Action` double DEFAULT NULL,
  `Adventure` double DEFAULT NULL,
  `Animation` double DEFAULT NULL,
  `Comedy` double DEFAULT NULL,
  `Crime` double DEFAULT NULL,
  `Drama` double DEFAULT NULL,
  `Fantasy` double DEFAULT NULL,
  `Family` double DEFAULT NULL,
  `Fiction` double DEFAULT NULL,
  `International` double DEFAULT NULL,
  `Horror` double DEFAULT NULL,
  `Mystery` double DEFAULT NULL,
  `Romance` double DEFAULT NULL,
  `SciFi` double DEFAULT NULL,
  `Thriller` double DEFAULT NULL,
  `TeleFilm` double DEFAULT NULL,
  `Documentary` double DEFAULT NULL,
  `History` double DEFAULT NULL,
  `Music` double DEFAULT NULL,
  `War` double DEFAULT NULL,
  `Western` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_base_movies_id_fk` (`film_id`),
  CONSTRAINT `reviews_base_movies_id_fk` FOREIGN KEY (`film_id`) REFERENCES `movies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45430 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `trending_10_app_movies`
--

DROP TABLE IF EXISTS `trending_10_app_movies`;
/*!50001 DROP VIEW IF EXISTS `trending_10_app_movies`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `trending_10_app_movies` AS SELECT 
 1 AS `id`,
 1 AS `original_language`,
 1 AS `overview`,
 1 AS `poster_path`,
 1 AS `release_date`,
 1 AS `revenue`,
 1 AS `tagline`,
 1 AS `title`,
 1 AS `review_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(120) NOT NULL,
  `dob` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `watchlist`
--

DROP TABLE IF EXISTS `watchlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watchlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `film_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_film` (`user_id`,`film_id`),
  KEY `film_id` (`film_id`),
  CONSTRAINT `watchlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `watchlist_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `movies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'MovieRecap'
--
/*!50003 DROP PROCEDURE IF EXISTS `deleteUserAccount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUserAccount`(
    IN userId INT,
    IN userUsername VARCHAR(50),
    IN userPassword VARCHAR(50),
    OUT status INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET status = -1;
    END;

    START TRANSACTION;

    UPDATE reviews SET user_id = NULL WHERE user_id = userId;
    DELETE FROM watchlist WHERE user_id = userId;

    DELETE FROM users WHERE id = userId AND username = userUsername AND password = userPassword;

    IF ROW_COUNT() = 0 THEN
        ROLLBACK;
        SET status = 0;
    ELSE
        COMMIT;
        SET status = 1;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `trending_10_app_movies`
--

/*!50001 DROP VIEW IF EXISTS `trending_10_app_movies`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `trending_10_app_movies` AS select `m`.`id` AS `id`,`m`.`original_language` AS `original_language`,`m`.`overview` AS `overview`,`m`.`poster_path` AS `poster_path`,`m`.`release_date` AS `release_date`,`m`.`revenue` AS `revenue`,`m`.`tagline` AS `tagline`,`m`.`title` AS `title`,count(0) AS `review_count` from (`reviews` `r` join `movies` `m` on((`r`.`film_id` = `m`.`id`))) group by `m`.`id` order by `review_count` desc limit 10 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-15 20:59:32
