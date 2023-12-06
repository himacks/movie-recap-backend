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
const user_1 = require("../db/user");
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObject = req.body;
        const newUser = userObject;
        yield user_1.default.addUser(newUser);
        const matchedUser = yield user_1.default.findUserByUsernameAndPassword(newUser.username, newUser.password);
        res.status(201).send({
            message: "User added successfully",
            result: matchedUser
        });
    }
    catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.code
        });
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const matchedUser = yield user_1.default.findUserByUsernameAndPassword(username, password);
        if (matchedUser) {
            res.status(200).send({
                message: "Login successful",
                result: matchedUser
            });
        }
        else {
            res.status(401).send({
                message: "Invalid credentials"
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.code
        });
    }
});
exports.default = { addNewUser, loginUser };
