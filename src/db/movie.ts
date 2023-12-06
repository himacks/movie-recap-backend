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

export default {getMovieById, getMoviesByName, getMoviesByFilmIds};
