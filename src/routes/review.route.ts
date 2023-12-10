import {Router} from "express";
import reviewController from "../controller/review.controller";
import validateReview from "../middlewares/validateReview";
const reviewRouter = Router();
reviewRouter.post("/add", validateReview, reviewController.addNewReview);
reviewRouter.get("/", reviewController.getReviews);

export default reviewRouter;
