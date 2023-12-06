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
            error: err.code
        });
    }
};

const getReviews = async (req: Request, res: Response) => {
    try {
        const filmId = parseInt(req.params.film_id);
        if (isNaN(filmId)) {
            return res.status(400).send({
                message: "Invalid film_id"
            });
        }

        const reviews = await review.getReviewsByFilmId(filmId);

        res.status(200).send({
            message: "Reviews fetched successfully",
            result: reviews
        });
    } catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.code
        });
    }
};

export default {addNewReview, getReviews};
