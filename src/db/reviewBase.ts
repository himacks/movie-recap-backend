import {PoolConnection, QueryError} from "mysql2";
import {connection} from "../config/db";
import {FilmScore} from "../models/filmScore";

// db function to get top (limit) film scores given up to 3 genres
// uses a sub query to get each movie along with a new property that
// sums genres scores and applies a weight
// sorts results and returns the top (limit)
const getFilmScoresByGenres = (
    genre1: string,
    genre2: string,
    genre3: string,
    limit: number
): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            // sub query within a query
            const query = `
                SELECT * FROM (
                    SELECT 
                        film_id,
                        (vote_count * ((IFNULL(${genre1}, 0) * 3) + (IFNULL(${genre2}, 0) * 2) + IFNULL(${genre3}, 0))) AS score
                    FROM reviews_base
                    ORDER BY score DESC
                    LIMIT ?
                ) AS moviesByGenreTable;
            `;

            conn.query(query, [limit], (err, results) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(results as FilmScore[]);
            });
        });
    });
};

export default {getFilmScoresByGenres};
