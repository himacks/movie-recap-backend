import {Router} from "express";
import watchlistController from "../controller/watchlist.controller";

const movieRouter = Router();

movieRouter.post("/add", watchlistController.addUserFilmToWatch);
movieRouter.delete("/remove", watchlistController.removeUserFilmToWatch);
movieRouter.get("/", watchlistController.getUserFilmsToWatch);
movieRouter.get("/watched", watchlistController.getUserWatchedFilms);

export default movieRouter;
