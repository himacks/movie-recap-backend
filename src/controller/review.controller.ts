import review from "../db/review";
import {Request, Response} from "express";
import {Review} from "../models/review";

// review controller file, attached to api endpoints and handled here

// controller to post a new review, handles body request data
// sends parsed body data to db function that handles data
// sends success or failure message to caller
const addNewReview = async (req: Request, res: Response) => {
    try {
        const reviewObject: Partial<Omit<Review, "id">> = req.body;

        // calls db function here
        await review.addReview(reviewObject);

        res.status(201).send({
            message: "Review added successfully"
        });
    } catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err
        });
    }
};

// controller to delete a review given an id
// sends success or failure message to caller
const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = parseInt(req.query.id as string);
        if (isNaN(reviewId)) {
            return res.status(400).send({
                message: "Invalid review ID"
            });
        }

        // calls delete review db function here
        await review.deleteReviewById(reviewId);
        res.status(200).send({
            message: "Review deleted successfully"
        });
    } catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err
        });
    }
};

// controller to query for review by either film_id or user_id
// calls associated db functions based on parameter inputs
// cannot query by both, just combined for convenience
// movie id overrides user_id
// sends back a list of reviews to caller
const getReviews = async (req: Request, res: Response) => {
    try {
        const {film_id, user_id} = req.query;

        if (film_id) {
            const filmId = parseInt(film_id as string);
            if (isNaN(filmId)) {
                return res.status(400).send({
                    message: "Invalid film_id"
                });
            }

            // calls db function here to get review by movie id
            const reviewsByFilm = await review.getReviewsByMovieId(filmId);
            return res.status(200).send({
                message: "Reviews by film fetched successfully",
                result: reviewsByFilm
            });
        }

        if (user_id) {
            const userId = parseInt(user_id as string);
            if (isNaN(userId)) {
                return res.status(400).send({
                    message: "Invalid user_id"
                });
            }

            // calls db function here to get reviews from user
            const reviewsByUser = await review.getReviewsByUserId(userId);
            return res.status(200).send({
                message: "Reviews by user fetched successfully",
                result: reviewsByUser
            });
        }

        return res.status(400).send({
            message: "Please provide either film_id or user_id"
        });
    } catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err
        });
    }
};

export default {addNewReview, getReviews, deleteReview};
