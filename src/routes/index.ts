import {Router} from "express";
import userRouter from "./user.route";
import reviewRouter from "./review.route";
import movieRouter from "./movie.route";
import watchlistRouter from "./watchlist.route";
const routes = Router();
// define the base path and the router that's going to be called
routes.use("/users", userRouter);
routes.use("/reviews", reviewRouter);
routes.use("/movies", movieRouter);
routes.use("/watchlist", watchlistRouter);
// export the route
export default routes;
