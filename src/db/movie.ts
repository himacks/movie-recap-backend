import {PoolConnection, QueryError} from "mysql2";
import {Movie} from "../models/movie";
import {connection} from "../config/db";

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

const getActorsByMovieId = (movieId: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err, conn) => {
            if (err) return reject(err);

            const query = `
                SELECT a.id, a.actor_name, a.profile_path 
                FROM actors a
                JOIN actor_to_film atf ON a.id = atf.actor_id
                WHERE atf.film_id = ?`;

            conn.query(query, [movieId], (err, results) => {
                conn.release();
                if (err) return reject(err);
                return resolve(results as any[]);
            });
        });
    });
};

const getDirectorsByMovieId = (movieId: number): Promise<any[]> => {
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
                return resolve(results as any[]);
            });
        });
    });
};

export default {
    getMovieById,
    getMoviesByName,
    getMoviesByFilmIds,
    getActorsByMovieId,
    getDirectorsByMovieId
};
