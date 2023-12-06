"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateReview(req, res, next) {
    const review = req.body;
    review.film_id = parseInt(review.film_id);
    review.user_id = parseInt(review.user_id);
    if (isNaN(review.film_id) || isNaN(review.user_id) || typeof review.comments !== "string") {
        return res.status(400).send({ message: "Invalid review data" });
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
                return res.status(400).send({ message: `Invalid type for ${field}` });
            }
        }
    }
    next();
}
exports.default = validateReview;
