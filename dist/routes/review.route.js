"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controller/review.controller");
const validateReview_1 = require("../middlewares/validateReview");
const reviewRouter = (0, express_1.Router)();
reviewRouter.post("/add", validateReview_1.default, review_controller_1.default.addNewReview);
reviewRouter.get("/:film_id", review_controller_1.default.getReviews);
exports.default = reviewRouter;
