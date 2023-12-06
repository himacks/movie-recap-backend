// routes/movie.route.ts

import {Router} from "express";
import movieController from "../controller/movie.controller";

const movieRouter = Router();

movieRouter.get("/search", movieController.searchMovies);
movieRouter.get("/genre", movieController.searchMoviesByGenreScore);

export default movieRouter;
