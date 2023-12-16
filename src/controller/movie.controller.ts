import movie from "../db/movie";
import review from "../db/review";
import reviewBase from "../db/reviewBase";
import {Request, Response} from "express";
import {FilmScore} from "../models/filmScore";

// movie controller file, attached to api endpoints and handled here

// controller to handle search for movie
// sends back list of movies in response
const searchMovies = async (req: Request, res: Response) => {
    try {
        // extract either name or id, id overrides name, can't use in combination
        // but allows for flexibility in how you query
        const {name, id} = req.query;

        if (id) {
            const movieId = parseInt(id as string);
            if (isNaN(movieId)) {
                return res.status(400).send({message: "Invalid movie ID"});
            }

            // calls db function to get movie by id
            const matchedMovie = await movie.getMovieById(movieId);
            if (matchedMovie) {
                return res
                    .status(200)
                    .send({message: "Movie fetched successfully", result: matchedMovie});
            }
        } else if (name) {
            // calls db functon to get movie by name
            const matchedMovies = await movie.getMoviesByName(name as string);
            if (matchedMovies.length > 0) {
                return res
                    .status(200)
                    .send({message: "Movies fetched successfully", result: matchedMovies});
            }
        }

        return res.status(404).send({message: "Movie not found"});
    } catch (err) {
        // if error notify caller
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

// function to search movies by genre, handles up to 3 genre inputs
// and includes a limit
// sends back list of movies in response
const searchMoviesByGenreScore = async (req: Request, res: Response) => {
    try {
        const {genre1, genre2, genre3, limit} = req.query;

        // default limit 10
        const limitNumber = limit ? parseInt(limit as string) : 10;

        // calls db function to get top scores of movies for given weighted genres
        const filmScores: FilmScore[] = await reviewBase.getFilmScoresByGenres(
            (genre1 as string) || null,
            (genre2 as string) || null,
            (genre3 as string) || null,
            limitNumber
        );

        // converts ids to movies
        const filmIds = filmScores.map((filmScore: FilmScore) => filmScore.film_id);

        const movies = await movie.getMoviesByFilmIds(filmIds);

        res.status(200).send({message: "Movies fetched successfully", result: movies});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

// function to get a specific movie details, attaches actor and directors
// sends back movie, list of actors, director, and list of reviews in response
const getMovieDetails = async (req: Request, res: Response) => {
    const {id} = req.query;

    try {
        const movieId = parseInt(id as string);
        if (isNaN(movieId)) {
            return res.status(400).send({message: "Invalid movie ID"});
        }

        // fetch movie details through db function
        const movieDetails = await movie.getMovieById(movieId);
        if (!movieDetails) {
            return res.status(404).send({message: "Movie not found"});
        }

        // fetch all reviews, directors, and actors associated to movie
        const [actors, directors, reviews] = await Promise.all([
            movie.getActorsByMovieId(movieId),
            movie.getDirectorsByMovieId(movieId),
            review.getReviewsByMovieId(movieId)
        ]);

        res.status(200).send({
            message: "Movie details fetched successfully",
            result: {
                movie: movieDetails,
                actors: actors,
                directors: directors,
                reviews: reviews
            }
        });
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

// function to get the most reviewed movies within our app
// sends back list of top 10 trending movies in response
const getTrendingMovies = async (req: Request, res: Response) => {
    try {
        const trendingMovies = await movie.getTrendingMovies();
        res.status(200).send({message: "Trending Movies fetched successfully", trendingMovies});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

export default {searchMovies, searchMoviesByGenreScore, getMovieDetails, getTrendingMovies};
