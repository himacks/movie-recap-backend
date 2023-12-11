import {PoolConnection, QueryError} from "mysql2";
import {User} from "../models/user";
import {connection} from "../config/db";

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

const getUserStats = (userId: number): Promise<{watchedCount: number; watchlistCount: number}> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const watchedQuery =
                "SELECT COUNT(DISTINCT film_id) AS watchedCount FROM reviews WHERE user_id = ?";
            conn.query(watchedQuery, [userId], (err, watchedResults) => {
                if (err) {
                    conn.release();
                    return reject(err);
                }

                const watchlistQuery =
                    "SELECT COUNT(*) AS watchlistCount FROM watchlist WHERE user_id = ?";
                conn.query(watchlistQuery, [userId], (err, watchlistResults) => {
                    conn.release();
                    if (err) return reject(err);

                    const stats = {
                        watchedCount: watchedResults[0].watchedCount,
                        watchlistCount: watchlistResults[0].watchlistCount
                    };
                    return resolve(stats);
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

export default {addUser, findUserByUsernameAndPassword, updateUser, deleteUser, getUserStats};
