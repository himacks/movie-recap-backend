"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const movie_1 = require("../db/movie");
const review_1 = require("../db/review");
const reviewBase_1 = require("../db/reviewBase");
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, id } = req.query;
        if (id) {
            const movieId = parseInt(id);
            if (isNaN(movieId)) {
                return res.status(400).send({ message: "Invalid movie ID" });
            }
            const matchedMovie = yield movie_1.default.getMovieById(movieId);
            if (matchedMovie) {
                return res
                    .status(200)
                    .send({ message: "Movie fetched successfully", result: matchedMovie });
            }
        }
        else if (name) {
            const matchedMovies = yield movie_1.default.getMoviesByName(name);
            if (matchedMovies.length > 0) {
                return res
                    .status(200)
                    .send({ message: "Movies fetched successfully", result: matchedMovies });
            }
        }
        return res.status(404).send({ message: "Movie not found" });
    }
    catch (err) {
        res.status(500).send({ message: "DATABASE ERROR", error: err });
    }
});
const searchMoviesByGenreScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genre1, genre2, genre3, limit } = req.query;
        const limitNumber = limit ? parseInt(limit) : 10;
        const filmScores = yield reviewBase_1.default.getFilmScoresByGenres(genre1 || null, genre2 || null, genre3 || null, limitNumber);
        const filmIds = filmScores.map((filmScore) => filmScore.film_id);
        const movies = yield movie_1.default.getMoviesByFilmIds(filmIds);
        res.status(200).send({ message: "Movies fetched successfully", result: movies });
    }
    catch (err) {
        res.status(500).send({ message: "DATABASE ERROR", error: err });
    }
});
const getMovieDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const movieId = parseInt(id);
        if (isNaN(movieId)) {
            return res.status(400).send({ message: "Invalid movie ID" });
        }
        // Fetching movie details
        const movieDetails = yield movie_1.default.getMovieById(movieId);
        if (!movieDetails) {
            return res.status(404).send({ message: "Movie not found" });
        }
        const [actors, directors, reviews] = yield Promise.all([
            movie_1.default.getActorsByMovieId(movieId),
            movie_1.default.getDirectorsByMovieId(movieId),
            review_1.default.getReviewsByMovieId(movieId)
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
    }
    catch (err) {
        res.status(500).send({ message: "DATABASE ERROR", error: err });
    }
});
exports.default = { searchMovies, searchMoviesByGenreScore, getMovieDetails };
