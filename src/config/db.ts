import {createPool} from "mysql2";

//config to setup sql connection
export const connection = createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "chickennugget",
    database: "MovieRecap",
    multipleStatements: true
});
