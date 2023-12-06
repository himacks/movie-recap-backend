import {PoolConnection, QueryError} from "mysql2";
import {connection} from "../config/db";

const getFilmScoresByGenres = (
    genre1: string,
    genre2: string,
    genre3: string,
    limit: number
): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) return reject(err);

            const createTempTable = `
                CREATE TEMPORARY TABLE IF NOT EXISTS TempMovieScores AS
                SELECT 
                    film_id,
                    (vote_count * ((IFNULL(${genre1}, 0) * 3) + (IFNULL(${genre2}, 0) * 2) + IFNULL(${genre3}, 0))) AS score
                FROM reviews_base
                ORDER BY score DESC
                LIMIT ?;
            `;

            conn.query(createTempTable, [limit], (err) => {
                if (err) {
                    conn.release();
                    return reject(err);
                }

                const selectFromTemp = `SELECT * FROM TempMovieScores;`;
                conn.query(selectFromTemp, (err, results) => {
                    if (err) {
                        conn.release();
                        return reject(err);
                    }

                    const dropTempTable = `DROP TEMPORARY TABLE IF EXISTS TempMovieScores;`;
                    conn.query(dropTempTable, (err) => {
                        conn.release();
                        if (err) return reject(err);
                        return resolve(results as any[]);
                    });
                });
            });
        });
    });
};

export default {getFilmScoresByGenres};
