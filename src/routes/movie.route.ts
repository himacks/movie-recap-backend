import {Router} from "express";
import movieController from "../controller/movie.controller";

const movieRouter = Router();

movieRouter.get("/search", movieController.searchMovies);
movieRouter.get("/genre", movieController.searchMoviesByGenreScore);
movieRouter.get("/details", movieController.getMovieDetails);

export default movieRouter;
