import {PoolConnection, QueryError} from "mysql2";
import {Review} from "../models/review";
import {connection} from "../config/db";

const addReview = (newReview: Partial<Omit<Review, "id">>): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            const query = `INSERT INTO reviews (${Object.keys(newReview).join(
                ", "
            )}) VALUES (${"?, ".repeat(Object.keys(newReview).length).slice(0, -2)})`;

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

const getReviewsByFilmId = (filmId: number): Promise<Review[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            const query = "SELECT * FROM reviews WHERE film_id = ?";
            conn.query(query, [filmId], (err, results) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(results as Review[]);
            });
        });
    });
};

export default {addReview, getReviewsByFilmId};
