import user from "../db/user";
import {Request, Response} from "express";
import {User} from "../models/user";

const addNewUser = async (req: Request, res: Response) => {
    try {
        const userObject = req.body;

        const newUser: Omit<User, "id"> = userObject;

        await user.addUser(newUser);

        const matchedUser = await user.findUserByUsernameAndPassword(
            newUser.username,
            newUser.password
        );

        res.status(201).send({
            message: "User added successfully",
            result: matchedUser
        });
    } catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.code
        });
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;

        const matchedUser = await user.findUserByUsernameAndPassword(username, password);
        if (matchedUser) {
            res.status(200).send({
                message: "Login successful",
                result: matchedUser
            });
        } else {
            res.status(401).send({
                message: "Invalid credentials"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.code
        });
    }
};

export default {addNewUser, loginUser};
