import {Request, Response, NextFunction} from "express";

// middleware to attempt to validate user data, whenever a new user is signed
// up or updated, ensure the right data is sent.
export default function validateUser(req: Request, res: Response, next: NextFunction) {
    const user = req.body;

    if (user.id !== undefined) {
        user.id = parseInt(user.id);
        if (isNaN(user.id)) {
            return res.status(400).send({message: "Invalid type for id"});
        }
    }

    if (user.username !== undefined && typeof user.username !== "string") {
        return res.status(400).send({message: "Invalid type for username"});
    }

    if (user.password !== undefined && typeof user.password !== "string") {
        return res.status(400).send({message: "Invalid type for password"});
    }

    if (user.email !== undefined && typeof user.email !== "string") {
        return res.status(400).send({message: "Invalid type for email"});
    }

    if (user.dob !== undefined) {
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/; // regex for YYYY-MM-DD format
        if (typeof user.dob !== "string" || !dobRegex.test(user.dob)) {
            return res
                .status(400)
                .send({message: "Invalid format for dob. Format should be YYYY-MM-DD"});
        }

        user.dob = new Date(user.dob);
        if (isNaN(user.dob.getTime())) {
            return res.status(400).send({message: "Invalid date for dob"});
        }
    }

    next();
}
