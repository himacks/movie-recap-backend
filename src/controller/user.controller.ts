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
            error: err
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
            error: err
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.body.id as string);
        if (isNaN(userId)) {
            return res.status(400).send({
                message: "Invalid userId"
            });
        }

        const updateData: Partial<User> = req.body;

        await user.updateUser(userId, updateData);

        res.status(200).send({
            message: "User updated successfully"
        });
    } catch (err) {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const {id, username, password} = req.body;

        const userId = parseInt(id as string);
        if (isNaN(userId)) {
            return res.status(400).send({
                message: "Invalid userId"
            });
        }

        await user.deleteUser(userId, username, password);
        res.status(200).send({message: "User account deleted successfully"});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

export default {addNewUser, loginUser, updateUser, deleteUser};
