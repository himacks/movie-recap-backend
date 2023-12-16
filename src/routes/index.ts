import {Router} from "express";
import userRouter from "./user.route";
import reviewRouter from "./review.route";
import movieRouter from "./movie.route";
import watchlistRouter from "./watchlist.route";
const routes = Router();

//route definer for where to redirect url endpoint to what controllers
routes.use("/users", userRouter);
routes.use("/reviews", reviewRouter);
routes.use("/movies", movieRouter);
routes.use("/watchlist", watchlistRouter);

export default routes;
