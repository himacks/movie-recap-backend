import review from "../db/review";
import {Request, Response} from "express";
import {Review} from "../models/review";

const addNewReview = async (req: Request, res: Response) => {
    try {
        const reviewObject: Partial<Omit<Review, "id">> = req.body;

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
const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = parseInt(req.query.id as string);
        if (isNaN(reviewId)) {
            return res.status(400).send({
                message: "Invalid review ID"
            });
        }

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
