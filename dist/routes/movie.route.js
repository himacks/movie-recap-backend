"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("../controller/movie.controller");
const movieRouter = (0, express_1.Router)();
movieRouter.get("/search", movie_controller_1.default.searchMovies);
movieRouter.get("/genre", movie_controller_1.default.searchMoviesByGenreScore);
movieRouter.get("/details", movie_controller_1.default.getMovieDetails);
exports.default = movieRouter;
