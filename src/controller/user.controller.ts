import user from "../db/user";
import {Request, Response} from "express";
import {User} from "../models/user";

// user controller file, attached to api endpoints and handled here

// controller to add a new user to db
// accepts post body data, parses it and sends to db function for insertion
// sends back the user data so the caller can get an ID of the new user
const addNewUser = async (req: Request, res: Response) => {
    try {
        const userObject = req.body;

        const newUser: Omit<User, "id"> = userObject;

        // adds a new user to database
        await user.addUser(newUser);

        // checks if user exists by querying for it, if so return created user
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

// controller to log in user to database by checking for match wih user, pass
// sends data to db function
// sends back data of USER so we can get an ID to work with for future calls
const loginUser = async (req: Request, res: Response) => {
    try {
        // extracts user,pass from post body data
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

// controller to update user details, given a user id and any modified parameters
// sends back success or error message to caller
const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.body.id as string);
        if (isNaN(userId)) {
            return res.status(400).send({
                message: "Invalid userId"
            });
        }

        const updateData: Partial<User> = req.body;

        //sends update data to db function to handle
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

// controller to delete a user given a id, username, and password
// ideally we would hash this, but this project is not centered around security
// but rather SQL practice

// sends back success or error message
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

// controller to get statistics of user like favorite actor, director, watch
// list count and watched movie count
const getUserStatistics = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.query.id as string);
        if (isNaN(userId)) {
            return res.status(400).send({message: "Invalid userId"});
        }

        const stats = await user.getUserOverallStats(userId);
        res.status(200).send({message: "User statistics fetched successfully", stats});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

export default {addNewUser, loginUser, updateUser, deleteUser, getUserStatistics};
