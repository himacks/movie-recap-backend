import {Router} from "express";
import watchlistController from "../controller/watchlist.controller";

const watchlistRouter = Router();

//all routes associated to watchlist controller going to appropriate functions

watchlistRouter.post("/add", watchlistController.addUserFilmToWatch);
watchlistRouter.delete("/remove", watchlistController.removeUserFilmToWatch);
watchlistRouter.get("/", watchlistController.getUserFilmsToWatch);
watchlistRouter.get("/csv", watchlistController.getCSVUserFilmsToWatch);
watchlistRouter.get("/watched", watchlistController.getUserWatchedFilms);

export default watchlistRouter;
