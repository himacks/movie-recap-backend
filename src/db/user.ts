import {PoolConnection, QueryError} from "mysql2";
import {User} from "../models/user";
import {connection} from "../config/db";
import {Actor} from "../models/actor";
import {Director} from "../models/director";

const addUser = (newUser: Omit<User, "id">): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            const query = "INSERT INTO users (username, password, email, dob) VALUES (?, ?, ?, ?)";
            conn.query(
                query,
                [newUser.username, newUser.password, newUser.email, newUser.dob],
                (err, result) => {
                    conn.release();
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                }
            );
        });
    });
};

const updateUser = (userId: number, updateData: Partial<User>): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            let query = "UPDATE users SET ";
            const queryParams = [];
            Object.keys(updateData).forEach((key, index) => {
                query += `${key} = ?`;
                query += index === Object.keys(updateData).length - 1 ? " " : ", ";
                queryParams.push(updateData[key]);
            });
            query += "WHERE id = ?";
            queryParams.push(userId);

            conn.query(query, queryParams, (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
};

const findUserByUsernameAndPassword = (
    username: string,
    password: string
): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            const query = "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1";
            conn.query(query, [username, password], (err, results) => {
                conn.release();

                resolve(results[0]);
            });
        });
    });
};
type UserStats = {
    watchedCount: number;
    watchlistCount: number;
    favoriteActor: Actor | null;
    favoriteDirector: Director | null;
};

const getUserOverallStats = (userId: number): Promise<UserStats> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            // Watched movies count
            const watchedQuery =
                "SELECT COUNT(DISTINCT film_id) AS watchedCount FROM reviews WHERE user_id = ?";
            // Watchlist movies count
            const watchlistQuery =
                "SELECT COUNT(*) AS watchlistCount FROM watchlist WHERE user_id = ?";
            // Favorite actor query
            const actorQuery = `
                SELECT a.id, a.actor_name, COUNT(*) as review_count
                FROM reviews r
                JOIN actor_to_film atf ON r.film_id = atf.film_id
                JOIN actors a ON atf.actor_id = a.id
                WHERE r.user_id = ?
                GROUP BY a.id
                ORDER BY review_count DESC
                LIMIT 1;`;
            // Favorite director query
            const directorQuery = `
                SELECT d.id, d.director_name, COUNT(*) as review_count
                FROM reviews r
                JOIN director_to_film dtf ON r.film_id = dtf.film_id
                JOIN directors d ON dtf.director_id = d.id
                WHERE r.user_id = ?
                GROUP BY d.id
                ORDER BY review_count DESC
                LIMIT 1;`;

            // Execute the watched movies count query
            conn.query(watchedQuery, [userId], (err, watchedResults) => {
                if (err) {
                    conn.release();
                    return reject(err);
                }

                // Execute the watchlist movies count query
                conn.query(watchlistQuery, [userId], (err, watchlistResults) => {
                    if (err) {
                        conn.release();
                        return reject(err);
                    }

                    // Execute the favorite actor query
                    conn.query(actorQuery, [userId], (err, actorResult) => {
                        if (err) {
                            conn.release();
                            return reject(err);
                        }

                        // Execute the favorite director query
                        conn.query(directorQuery, [userId], (err, directorResult) => {
                            conn.release();
                            if (err) return reject(err);

                            // Aggregate all stats
                            const stats: UserStats = {
                                watchedCount: watchedResults[0].watchedCount,
                                watchlistCount: watchlistResults[0].watchlistCount,
                                favoriteActor: actorResult[0] || null,
                                favoriteDirector: directorResult[0] || null
                            };

                            return resolve(stats);
                        });
                    });
                });
            });
        });
    });
};

const deleteUser = (userId: number, username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.query(
            "CALL deleteUserAccount(?, ?, ?, @status)",
            [userId, username, password],
            (err, results) => {
                connection.query("SELECT @status", (err, results) => {
                    const status = results[0]["@status"];

                    if (status == 1) {
                        return resolve();
                    } else if (status == 0) {
                        return reject(new Error("Error No Username/Password Combo Found"));
                    } else if (status == -1) {
                        return reject(new Error("DATABASE ERROR"));
                    }
                });
            }
        );
    });
};

//add user stats, like watch list count, watched list count, average review rating, favorite genres

export default {
    addUser,
    findUserByUsernameAndPassword,
    updateUser,
    deleteUser,
    getUserOverallStats
};
