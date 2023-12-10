import {PoolConnection, QueryError} from "mysql2";
import {connection} from "../config/db";
import {Movie} from "../models/movie";

const addUserFilmToWatch = (userId: number, filmId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const query = "INSERT INTO watchlist (user_id, film_id) VALUES (?, ?)";
            conn.query(query, [userId, filmId], (err) => {
                conn.release();
                if (err) return reject(err);
                resolve();
            });
        });
    });
};

const removeUserFilmToWatch = (userId: number, filmId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const query = "DELETE FROM watchlist WHERE user_id = ? AND film_id = ?";
            conn.query(query, [userId, filmId], (err) => {
                conn.release();
                if (err) return reject(err);
                resolve();
            });
        });
    });
};

const getUserFilmsToWatch = (userId: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const query = `
                SELECT m.*
                FROM watchlist
                JOIN movies m ON watchlist.film_id = m.id
                WHERE watchlist.user_id = ?`;

            conn.query(query, [userId], (err, results) => {
                conn.release();
                if (err) return reject(err);
                resolve(results as Movie[]);
            });
        });
    });
};

const getUserWatchedFilms = (userId: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const query = `
                SELECT DISTINCT m.*
                FROM reviews r
                JOIN movies m ON r.film_id = m.id
                WHERE r.user_id = ?`;

            conn.query(query, [userId], (err, results) => {
                conn.release();
                if (err) return reject(err);
                resolve(results as Movie[]);
            });
        });
    });
};

export default {
    addUserFilmToWatch,
    removeUserFilmToWatch,
    getUserFilmsToWatch,
    getUserWatchedFilms
};
