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

//add user stats, like watch list count, watched list count, average review rating, favorite genres

export default {addUser, findUserByUsernameAndPassword};
