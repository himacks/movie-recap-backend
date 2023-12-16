import {PoolConnection, QueryError} from "mysql2";
import {Review} from "../models/review";
import {connection} from "../config/db";
import {Movie} from "../models/movie";

// db function to add a review, because review properties are very dynamic
// we took a creative approach, by default values for genre scores are null
// this way we can just insert partial review data to fill in whatever is not
// null in the DB
const addReview = (newReview: Partial<Omit<Review, "id">>): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            // keys through newReview property keys, to insert the
            // number of placeholders that match the number of keys to query
            const query = `INSERT INTO reviews (${Object.keys(newReview).join(
                ", "
            )}) VALUES (${"?, ".repeat(Object.keys(newReview).length).slice(0, -2)})`;

            //insert newReview properties to query
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

// db function to delete a review given an ID
const deleteReviewById = (reviewId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            const query = "DELETE FROM reviews WHERE id = ?";
            conn.query(query, [reviewId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
};

// db function to get all reviews associated to am movie given a movie id
const getReviewsByMovieId = (filmId: number): Promise<Review[]> => {
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

// db function to get all reviews associated to a user given a user id
const getReviewsByUserId = (userId: number): Promise<Review[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            const query =
                "SELECT * FROM reviews JOIN movies ON reviews.film_id = movies.id WHERE user_id = ?";
            conn.query(query, [userId], (err, results) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                // map over the results and restructure each item
                // attempted to use join query to reduce DB calls, but now
                // we must reformat data to be more clean and usable
                const reviewsWithMovies = (results as (Movie & Review)[]).map((result) => {
                    const {
                        original_language,
                        overview,
                        poster_path,
                        release_date,
                        revenue,
                        tagline,
                        title,
                        ...reviewFields
                    } = result;

                    const movie = {
                        original_language,
                        overview,
                        poster_path,
                        release_date,
                        revenue,
                        tagline,
                        title
                    };

                    return {
                        ...reviewFields,
                        movie
                    };
                });

                return resolve(reviewsWithMovies as Review[]);
            });
        });
    });
};

export default {addReview, getReviewsByMovieId, getReviewsByUserId, deleteReviewById};
