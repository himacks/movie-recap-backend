import {Request, Response, NextFunction} from "express";

// middleware to validate incoming post body data, stringified data should
// be attempted to be converted to proper types
export default function validateReview(req: Request, res: Response, next: NextFunction) {
    const review = req.body;

    review.film_id = parseInt(review.film_id);
    review.user_id = parseInt(review.user_id);
    if (isNaN(review.film_id) || isNaN(review.user_id) || typeof review.comments !== "string") {
        return res.status(400).send({message: "Invalid review data"});
    }

    const optionalFields = [
        "Action",
        "Adventure",
        "Animation",
        "Comedy",
        "Crime",
        "Drama",
        "Fantasy",
        "Family",
        "Fiction",
        "International",
        "Horror",
        "Mystery",
        "Romance",
        "SciFi",
        "Thriller",
        "TeleFilm",
        "Documentary",
        "History",
        "Music",
        "War",
        "Western"
    ];
    for (const field of optionalFields) {
        if (review[field] !== undefined) {
            review[field] = parseFloat(review[field]);
            if (isNaN(review[field])) {
                return res.status(400).send({message: `Invalid type for ${field}`});
            }
        }
    }

    next();
}
