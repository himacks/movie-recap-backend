"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const getMovieById = (movieId) => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
            if (err)
                return reject(err);
            const query = "SELECT * FROM movies WHERE id = ?";
            conn.query(query, [movieId], (err, results) => {
                conn.release();
                if (err)
                    return reject(err);
                return resolve(results[0]);
            });
        });
    });
};
const getMoviesByName = (name) => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
            if (err)
                return reject(err);
            const query = "SELECT * FROM movies WHERE title LIKE ?";
            conn.query(query, [`%${name}%`], (err, results) => {
                conn.release();
                if (err)
                    return reject(err);
                return resolve(results);
            });
        });
    });
};
const getMoviesByFilmIds = (filmIds) => {
    return new Promise((resolve, reject) => {
        if (filmIds.length === 0) {
            return resolve([]);
        }
        db_1.connection.getConnection((err, conn) => {
            if (err)
                return reject(err);
            const placeholders = filmIds.map(() => "?").join(",");
            const query = `SELECT * FROM movies WHERE id IN (${placeholders})`;
            conn.query(query, filmIds, (err, results) => {
                conn.release();
                if (err)
                    return reject(err);
                return resolve(results);
            });
        });
    });
};
const getActorsByMovieId = (movieId) => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
            if (err)
                return reject(err);
            const query = `
                SELECT a.id, a.actor_name, a.profile_path 
                FROM actors a
                JOIN actor_to_film atf ON a.id = atf.actor_id
                WHERE atf.film_id = ?`;
            conn.query(query, [movieId], (err, results) => {
                conn.release();
                if (err)
                    return reject(err);
                return resolve(results);
            });
        });
    });
};
const getDirectorsByMovieId = (movieId) => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
            if (err)
                return reject(err);
            const query = `
                SELECT d.id, d.director_name, d.profile_path 
                FROM directors d
                JOIN director_to_film dtf ON d.id = dtf.director_id
                WHERE dtf.film_id = ?`;
            conn.query(query, [movieId], (err, results) => {
                conn.release();
                if (err)
                    return reject(err);
                return resolve(results);
            });
        });
    });
};
exports.default = {
    getMovieById,
    getMoviesByName,
    getMoviesByFilmIds,
    getActorsByMovieId,
    getDirectorsByMovieId
};
