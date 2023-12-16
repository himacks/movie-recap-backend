import {Router} from "express";
import reviewController from "../controller/review.controller";
import validateReview from "../middlewares/validateReview";
const reviewRouter = Router();

//all routes associated to reivew controller going to appropriate functions

reviewRouter.post("/add", validateReview, reviewController.addNewReview);
reviewRouter.delete("/delete", reviewController.deleteReview);
reviewRouter.get("/", reviewController.getReviews);

export default reviewRouter;
