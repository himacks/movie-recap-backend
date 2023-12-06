"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const addReview = (newReview) => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            const query = `INSERT INTO reviews (${Object.keys(newReview).join(", ")}) VALUES (${"?, ".repeat(Object.keys(newReview).length).slice(0, -2)})`;
            console.log(query);
            conn.query(query, Object.values(newReview), (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
};
const getReviewsByFilmId = (filmId) => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            const query = "SELECT * FROM reviews WHERE film_id = ?";
            conn.query(query, [filmId], (err, results) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    });
};
exports.default = { addReview, getReviewsByFilmId };
