import movie from "../db/movie";
import reviewBase from "../db/reviewBase";
import {Request, Response} from "express";

const searchMovies = async (req: Request, res: Response) => {
    try {
        const {name, id} = req.query;

        if (id) {
            const movieId = parseInt(id as string);
            if (isNaN(movieId)) {
                return res.status(400).send({message: "Invalid movie ID"});
            }

            const matchedMovie = await movie.getMovieById(movieId);
            if (matchedMovie) {
                return res
                    .status(200)
                    .send({message: "Movie fetched successfully", result: matchedMovie});
            }
        } else if (name) {
            const matchedMovies = await movie.getMoviesByName(name as string);
            if (matchedMovies.length > 0) {
                return res
                    .status(200)
                    .send({message: "Movies fetched successfully", result: matchedMovies});
            }
        }

        return res.status(404).send({message: "Movie not found"});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err.code});
    }
};

const searchMoviesByGenreScore = async (req: Request, res: Response) => {
    try {
        const {genre1, genre2, genre3, limit} = req.query;

        const limitNumber = limit ? parseInt(limit as string) : 10;

        const filmScores = await reviewBase.getFilmScoresByGenres(
            (genre1 as string) || null,
            (genre2 as string) || null,
            (genre3 as string) || null,
            limitNumber
        );

        const filmIds = filmScores.map((filmScore: any) => filmScore.film_id);

        const movies = await movie.getMoviesByFilmIds(filmIds);

        res.status(200).send({message: "Movies fetched successfully", result: movies});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err.code});
    }
};

export default {searchMovies, searchMoviesByGenreScore};