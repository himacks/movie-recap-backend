"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const userRouter = (0, express_1.Router)();
// specifies the endpoint and the method to call
userRouter.post("/signup", user_controller_1.default.addNewUser);
userRouter.post("/login", user_controller_1.default.loginUser);
// export the router
exports.default = userRouter;
