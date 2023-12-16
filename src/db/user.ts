import {PoolConnection, QueryError} from "mysql2";
import {User} from "../models/user";
import {connection} from "../config/db";
import {Actor} from "../models/actor";
import {Director} from "../models/director";
import {UserStats} from "../models/userStats";

// db function to add a user to the database
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

// db function to update a user
// because updates can be dynamic, as in some times we update email, other
// times we want to update password, we used partial objects and then dynamically
// added updated fields to query using the key names and key values to match
// the db
const updateUser = (userId: number, updateData: Partial<User>): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                return reject(err);
            }

            // build query using updated params and match by user id
            let query = "UPDATE users SET ";
            const queryParams = [];
            // iterates through partial object keys and appends key name to query
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

// db function to find a user given a username and password match
// returns the user object match in db
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

// db function to get user stats like their watchlist count, watched movies count
// favorite actor and director ( derived from most occuring actor/director in
// user's movies watched )
const getUserOverallStats = (userId: number): Promise<UserStats> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            // watched movies count
            const watchedQuery = "SELECT COUNT(*) AS watchedCount FROM reviews WHERE user_id = ?";
            // watchlist movies count
            const watchlistQuery =
                "SELECT COUNT(*) AS watchlistCount FROM watchlist WHERE user_id = ?";
            // favorite actor query
            const actorQuery = `
                SELECT a.id, a.actor_name, COUNT(*) as review_count
                FROM reviews r
                JOIN actor_to_film atf ON r.film_id = atf.film_id
                JOIN actors a ON atf.actor_id = a.id
                WHERE r.user_id = ?
                GROUP BY a.id
                ORDER BY review_count DESC
                LIMIT 1;`;
            // favorite director query
            const directorQuery = `
                SELECT d.id, d.director_name, COUNT(*) as review_count
                FROM reviews r
                JOIN director_to_film dtf ON r.film_id = dtf.film_id
                JOIN directors d ON dtf.director_id = d.id
                WHERE r.user_id = ?
                GROUP BY d.id
                ORDER BY review_count DESC
                LIMIT 1;`;

            // execute all queries sequentially
            conn.query(watchedQuery, [userId], (err, watchedResults) => {
                if (err) {
                    conn.release();
                    return reject(err);
                }

                conn.query(watchlistQuery, [userId], (err, watchlistResults) => {
                    if (err) {
                        conn.release();
                        return reject(err);
                    }

                    conn.query(actorQuery, [userId], (err, actorResult) => {
                        if (err) {
                            conn.release();
                            return reject(err);
                        }

                        conn.query(directorQuery, [userId], (err, directorResult) => {
                            conn.release();
                            if (err) return reject(err);

                            // aggregate all stats and return as UserStats object
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

// db function to delete a user from the database
// we want to ensure integrity of db remains high, so we have a procedure
// to delete all user associated data except for reviews, where we update
// all user associated reviews to be redacted as written by NULL
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

export default {
    addUser,
    findUserByUsernameAndPassword,
    updateUser,
    deleteUser,
    getUserOverallStats
};
