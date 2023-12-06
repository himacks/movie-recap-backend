"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("./user.route");
const review_route_1 = require("./review.route");
const movie_route_1 = require("./movie.route");
const routes = (0, express_1.Router)();
// define the base path and the router that's going to be called
routes.use("/users", user_route_1.default);
routes.use("/reviews", review_route_1.default);
routes.use("/movies", movie_route_1.default);
// export the route
exports.default = routes;
