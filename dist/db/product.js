"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const selectAll = () => {
    return new Promise((resolve, reject) => {
        db_1.connection.getConnection((err, conn) => {
            conn.query("select * from product", (err, resultSet) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
};
exports.default = { selectAll };
