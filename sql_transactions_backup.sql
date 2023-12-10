USE MovieRecap;

CREATE TABLE director_to_film AS
SELECT
    id as film_id,
    SUBSTRING_INDEX(
        SUBSTRING_INDEX(
            SUBSTRING(
                crew,
                LOCATE('"job": "Director"', crew),
                LOCATE('}', crew, LOCATE('"job": "Director"', crew)) - LOCATE('"job": "Director"', crew) + 1
            ),
            '"name": "', -1
        ),
        '"', 1
    ) AS director_name,
    SUBSTRING_INDEX(
        SUBSTRING_INDEX(
            SUBSTRING(
                crew,
                LOCATE('"job": "Director"', crew),
                LOCATE('}', crew, LOCATE('"job": "Director"', crew)) - LOCATE('"job": "Director"', crew) + 1
            ),
            '"profile_path": "', -1
        ),
        '"', 1
    ) AS profile_path
FROM
    credits;
SELECT
    c.id AS film_id,
    jt.name AS actor_name,
    jt.char_name AS character_name,
    jt.profile_path
FROM
    credits c
CROSS JOIN JSON_TABLE(
    c.cast,
    '$[*]' COLUMNS(
        name VARCHAR(255) PATH '$.name',
        char_name VARCHAR(255) PATH '$.character',
        profile_path VARCHAR(255) PATH '$.profile_path'
    )
) AS jt;

DROP TABLE copy_credits;

CREATE TABLE copy_credits LIKE credits;
INSERT INTO copy_credits SELECT * FROM credits;


UPDATE copy_credits
SET cast = REPLACE(cast, '\'', '"');

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]*)"([^"]+)"([^"]*)", "c',
                '"character": "$1<<dq>>$2<<dq>>$3", "c'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]*)"([^"]*)"([^"]+)"([^"]*)", "c',
                '"character": "$1<<dq>>$2<<dq>>$3<<dq>>$4", "c'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]*)"([^"]*)"([^"]*)"([^"]+)"([^"]*)", "c',
                '"character": "$1<<dq>>$2<<dq>>$3<<dq>>$4<<dq>>$5", "c'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]+)"([^"]*)", "c',
                '"character": "$1<<dq>>$2<<dq>>$3<<dq>>$4<<dq>>$5<<dq>>$6", "c'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]+)"([^"]*)", "c',
                '"character": "$1<<dq>>$2<<dq>>$3<<dq>>$4<<dq>>$5<<dq>>$6<<dq>>$7", "c'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]+)"([^"]*)", "c',
                '"character": "$1<<dq>>$2<<dq>>$3<<dq>>$4<<dq>>$5<<dq>>$6<<dq>>$7<<dq>>$8", "c'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]*)"([^"]+)"([^"]*)", "c',
                '"character": "$1<<dq>>$2<<dq>>$3<<dq>>$4<<dq>>$5<<dq>>$6<<dq>>$7<<dq>>$8<<dq>>$9", "c'
            );


UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]*)""([^"]*)""([^"]*)", "c',
                '"character": "$1<<dq>>$2<<dq>>$3", "c'
            );


UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": "([^"]+)"([^"]*)", "c',
                '"character": "$1<<dq>>$2", "c'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"character": ""([^"]*)", "c',
                '"character": "<<dq>>$1", "c'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"name": "([^"]*)"([^"]+)"([^"]*)", "o',
                '"name": "$1<<dq>>$2<<dq>>$3", "o'
            );

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"name": "([^"]*)"([^"]*)"([^"]+)"([^"]*)", "o',
                '"name": "$1<<dq>>$2<<dq>>$3<<dq>>$4", "o'
            );


UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '"name": "([^"]+)"([^"]*)", "o',
                '"name": "$1<<dq>>$2", "o'
            );


UPDATE copy_credits
SET cast = REPLACE(cast, '<<dq>>', '\'');

UPDATE copy_credits
SET cast = REPLACE(cast, 'None', 'null');

UPDATE copy_credits
SET cast = REGEXP_REPLACE(
                cast,
                '\\\\',
                ''
            );

DELETE FROM copy_credits WHERE film_id = 'id';


SELECT
    film_id,
    cast
FROM
    copy_credits
WHERE
    JSON_VALID(cast) = 0;


CREATE TABLE credits_backup LIKE copy_credits;
INSERT INTO credits_backup SELECT * FROM copy_credits;

CREATE TABLE actor_to_film AS
SELECT
    c.film_id AS film_id,
    jt.name AS actor_name,
    jt.char_name AS character_name,
    jt.profile_path
FROM
    copy_credits c
CROSS JOIN JSON_TABLE(
    c.cast,
    '$[*]' COLUMNS(
        name VARCHAR(255) PATH '$.name',
        char_name VARCHAR(255) PATH '$.character',
        profile_path VARCHAR(255) PATH '$.profile_path'
    )
) AS jt;

CREATE TABLE actors (
    actor_id INT AUTO_INCREMENT PRIMARY KEY,
    actor_name VARCHAR(255),
    profile_path VARCHAR(255)
);

INSERT INTO actors (actor_name, profile_path)
SELECT DISTINCT actor_name, profile_path
FROM actor_to_film;

-- Add actor_id column to actor_to_film
ALTER TABLE actor_to_film ADD COLUMN actor_id INT;



CREATE INDEX idx_actor_name ON actors (actor_name);
CREATE INDEX idx_actor_to_film_name ON actor_to_film (actor_name);

-- Update actor_to_film with actor_id from actors table
UPDATE actor_to_film af
JOIN actors a ON af.actor_name = a.actor_name
SET af.actor_id = a.actor_id;

ALTER TABLE actor_to_film DROP COLUMN actor_name;


CREATE TABLE directors (
    director_id INT AUTO_INCREMENT PRIMARY KEY,
    director_name VARCHAR(255),
    profile_path VARCHAR(255)
);

ALTER TABLE director_to_film ADD COLUMN director_id INT;

CREATE INDEX idx_director_name ON directors (director_name);
CREATE INDEX idx_director_to_film_name ON director_to_film (director_name);

INSERT INTO directors (director_name, profile_path)
SELECT DISTINCT director_name, profile_path
FROM director_to_film;

UPDATE director_to_film df
JOIN directors d ON df.director_name = d.director_name
SET df.director_id = d.director_id;


ALTER TABLE director_to_film DROP COLUMN director_name;
ALTER TABLE director_to_film DROP COLUMN profile_path;

SELECT genres, popularity, vote_average, vote_count FROM movies;

CREATE TABLE movies_backup LIKE movies;

INSERT INTO movies_backup SELECT * FROM movies;


UPDATE movies
SET genres = REPLACE(genres, '\'', '"');

UPDATE movies
SET genres = REPLACE(genres, 'Foreign', 'International');

UPDATE movies
SET genres = REPLACE(genres, 'Science Fiction', 'SciFi');

UPDATE movies
SET genres = REPLACE(genres, 'TV Movie', 'TeleFilm');

SELECT * from movies WHERE id = 27205;

DROP TABLE IF EXISTS ;
CREATE TABLE IF NOT EXISTS  (
    id INT AUTO_INCREMENT PRIMARY KEY,
    film_id INT,
    vote_count INT,
    Action DOUBLE DEFAULT NULL,
    Adventure DOUBLE DEFAULT NULL,
    Animation DOUBLE DEFAULT NULL,
    Comedy DOUBLE DEFAULT NULL,
    Crime DOUBLE DEFAULT NULL,
    Drama DOUBLE DEFAULT NULL,
    Fantasy DOUBLE DEFAULT NULL,
    Family DOUBLE DEFAULT NULL,
    Fiction DOUBLE DEFAULT NULL,
    International DOUBLE DEFAULT NULL,
    Horror DOUBLE DEFAULT NULL,
    Mystery DOUBLE DEFAULT NULL,
    Romance DOUBLE DEFAULT NULL,
    SciFi DOUBLE DEFAULT NULL,
    Thriller DOUBLE DEFAULT NULL,
    TeleFilm DOUBLE DEFAULT NULL,
    Documentary DOUBLE DEFAULT NULL,
    History DOUBLE DEFAULT NULL,
    Music DOUBLE DEFAULT NULL,
    War DOUBLE DEFAULT NULL,
    Western DOUBLE DEFAULT NULL
);

-- Other parts of your script remain the same

DROP PROCEDURE IF EXISTS process_movie_reviews;

DELIMITER $$
CREATE PROCEDURE process_movie_reviews()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur_movie_id INT;
    DECLARE cur_genres_text TEXT;
    DECLARE cur_vote_average DOUBLE;
    DECLARE cur_vote_count INT;
    DECLARE cur_double_N DOUBLE;
    DECLARE cur_N INT;
    DECLARE cur_V DOUBLE;
    DECLARE cur_genre_name TEXT;
    DECLARE i INT;
    DECLARE genre_json JSON;

    DECLARE movie_cursor CURSOR FOR
        SELECT id, genres, vote_average, vote_count
        FROM movies;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN movie_cursor;

    read_loop: LOOP
        FETCH movie_cursor INTO cur_movie_id, cur_genres_text, cur_vote_average, cur_vote_count;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Calculate N and V
        SET cur_double_N = cur_vote_count / 100;
        IF cur_double_N < 1 THEN
            IF cur_double_N = 0 THEN
                SET cur_N = 0;
            ELSE
                SET cur_N = 1;
            END IF;
        ELSE
            SET cur_N = FLOOR(cur_double_N);
        END IF;
        SET cur_V = cur_vote_average / 2;

        -- Insert initial record with NULL genre ratings
        INSERT INTO  (film_id, vote_count) VALUES (cur_movie_id, cur_N);

        -- Get last inserted ID
        SET @last_id = LAST_INSERT_ID();

        -- Conditional genre update
        IF cur_N > 0 THEN
            -- Parse genres and update each genre rating
            SET i = 0;
            SET genre_json = JSON_EXTRACT(cur_genres_text, '$');
            WHILE JSON_LENGTH(genre_json) > i DO
                SET cur_genre_name = JSON_UNQUOTE(JSON_EXTRACT(genre_json, CONCAT('$[', i, '].name')));

                -- Update genre rating for the last inserted record
                SET @update_sql = CONCAT('UPDATE  SET ', cur_genre_name, ' = ', cur_V, ' WHERE id = ', @last_id);
                PREPARE stmt FROM @update_sql;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;

                SET i = i + 1;
            END WHILE;
        END IF;

    END LOOP read_loop;

    CLOSE movie_cursor;
END;
$$

DELIMITER ;

CALL process_movie_reviews();


## Action, Adventure, Animation, Comedy, Crime, Drama, Fantasy, Horror, Mystery, Romance, Science Fiction, Thriller, Documentary, Family, History, Music, War, Western,

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    film_id INT,
    user_id INT,
    comments VARCHAR(1000),
    Action DOUBLE DEFAULT NULL,
    Adventure DOUBLE DEFAULT NULL,
    Animation DOUBLE DEFAULT NULL,
    Comedy DOUBLE DEFAULT NULL,
    Crime DOUBLE DEFAULT NULL,
    Drama DOUBLE DEFAULT NULL,
    Fantasy DOUBLE DEFAULT NULL,
    Family DOUBLE DEFAULT NULL,
    Fiction DOUBLE DEFAULT NULL,
    International DOUBLE DEFAULT NULL,
    Horror DOUBLE DEFAULT NULL,
    Mystery DOUBLE DEFAULT NULL,
    Romance DOUBLE DEFAULT NULL,
    SciFi DOUBLE DEFAULT NULL,
    Thriller DOUBLE DEFAULT NULL,
    TeleFilm DOUBLE DEFAULT NULL,
    Documentary DOUBLE DEFAULT NULL,
    History DOUBLE DEFAULT NULL,
    Music DOUBLE DEFAULT NULL,
    War DOUBLE DEFAULT NULL,
    Western DOUBLE DEFAULT NULL
);

DELETE FROM users WHERE username = 'maxim';

ALTER TABLE users
ADD UNIQUE (username);

ALTER TABLE users
ADD UNIQUE (email);


CREATE TEMPORARY TABLE IF NOT EXISTS TempMovieScores AS
                 SELECT 
                     film_id,
                     (vote_count * ((IFNULL(Action, 0) * 3) +
                                    (IFNULL(Adventure, 0) * 2) +
                                     IFNULL(SciFi, 0))) AS score
                 FROM reviews_base
                 ORDER BY score DESC
                 LIMIT 10;
                 
SELECT * FROM TempMovieScores;

DROP TEMPORARY TABLE IF EXISTS TempMovieScores;

ALTER TABLE director_to_film
ADD CONSTRAINT director_to_film_movies_id_fk
FOREIGN KEY (film_id) REFERENCES movies (id);

# ALTER TABLE actor_to_film
# ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY;
#
# -- Create a temporary table
# CREATE TEMPORARY TABLE temp_actor_to_film AS SELECT film_id, actor_id, character_name FROM actor_to_film;
#
# -- Truncate the original table
# TRUNCATE TABLE actor_to_film;
#
# -- Insert data back into the original table
# INSERT INTO actor_to_film (film_id, actor_id, character_name) SELECT film_id, actor_id, character_name FROM temp_actor_to_film;
#
# -- Drop the temporary table
# DROP TEMPORARY TABLE temp_actor_to_film;

DELETE from actor_to_film WHERE
actor_to_film.film_id NOT IN (SELECT id FROM movies);

TRUNCATE reviews;

ALTER TABLE watchlist
ADD UNIQUE KEY unique_user_film (user_id, film_id);


