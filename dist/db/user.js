"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const addUser = (newUser) => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            const query = "INSERT INTO users (username, password, email, dob) VALUES (?, ?, ?, ?)";
            conn.query(query, [newUser.username, newUser.password, newUser.email, newUser.dob], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
};
const findUserByUsernameAndPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
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
exports.default = { addUser, findUserByUsernameAndPassword };
