"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_1 = require("../db/review");
const addNewReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewObject = req.body;
        yield review_1.default.addReview(reviewObject);
        res.status(201).send({
            message: "Review added successfully"
        });
    }
    catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.code
        });
    }
});
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filmId = parseInt(req.params.film_id);
        if (isNaN(filmId)) {
            return res.status(400).send({
                message: "Invalid film_id"
            });
        }
        const reviews = yield review_1.default.getReviewsByFilmId(filmId);
        res.status(200).send({
            message: "Reviews fetched successfully",
            result: reviews
        });
    }
    catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.code
        });
    }
});
exports.default = { addNewReview, getReviews };
