import {PoolConnection, QueryError} from "mysql2";
import {Movie} from "../models/movie";
import {connection} from "../config/db";
import {Actor} from "../models/actor";
import {Director} from "../models/director";

// db function to get movie by movie id
const getMovieById = (movieId: number): Promise<Movie | null> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const query = "SELECT * FROM movies WHERE id = ?";
            conn.query(query, [movieId], (err, results) => {
                conn.release();
                if (err) return reject(err);
                return resolve(results[0] as Movie);
            });
        });
    });
};
// db function to get all movies matching a name
const getMoviesByName = (name: string): Promise<Movie[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const query = "SELECT * FROM movies WHERE title LIKE ?";
            conn.query(query, [`%${name}%`], (err, results) => {
                conn.release();
                if (err) return reject(err);
                return resolve(results as Movie[]);
            });
        });
    });
};

// db function to get all movies that are inside a list of film ids,
// useful for batch fetching
const getMoviesByFilmIds = (filmIds: number[]): Promise<Movie[]> => {
    return new Promise((resolve, reject) => {
        if (filmIds.length === 0) {
            return resolve([]);
        }

        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const placeholders = filmIds.map(() => "?").join(",");
            const query = `SELECT * FROM movies WHERE id IN (${placeholders})`;

            conn.query(query, filmIds, (err, results) => {
                conn.release();
                if (err) return reject(err);
                return resolve(results as Movie[]);
            });
        });
    });
};

// db function to get all actors from a movie given movie id
const getActorsByMovieId = (movieId: number): Promise<Actor[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err, conn) => {
            if (err) return reject(err);

            const query = `
                SELECT a.id, a.actor_name, a.profile_path, atf.character_name
                FROM actors a
                JOIN actor_to_film atf ON a.id = atf.actor_id
                WHERE atf.film_id = ?`;

            conn.query(query, [movieId], (err, results) => {
                conn.release();
                if (err) return reject(err);
                return resolve(results as Actor[]);
            });
        });
    });
};

// db function to get all directors from a movie given movie id, joins on
// director table
const getDirectorsByMovieId = (movieId: number): Promise<Director[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err, conn) => {
            if (err) return reject(err);

            const query = `
                SELECT d.id, d.director_name, d.profile_path 
                FROM directors d
                JOIN director_to_film dtf ON d.id = dtf.director_id
                WHERE dtf.film_id = ?`;

            conn.query(query, [movieId], (err, results) => {
                conn.release();
                if (err) return reject(err);
                return resolve(results as Director[]);
            });
        });
    });
};

// db function to call a DB view to get list of most reviewed movies from
// MovieRecap
const getTrendingMovies = (): Promise<Movie[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const query = "SELECT * FROM trending_10_app_movies";
            conn.query(query, (err, results) => {
                conn.release();
                if (err) return reject(err);
                return resolve(results as Movie[]);
            });
        });
    });
};

export default {
    getMovieById,
    getMoviesByName,
    getMoviesByFilmIds,
    getActorsByMovieId,
    getDirectorsByMovieId,
    getTrendingMovies
};
