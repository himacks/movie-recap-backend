import {Request, Response} from "express";
import watchlist from "../db/watchlist";
import {convertToCSV} from "../helpers";

// watchlist controller file, attached to api endpoints and handled here

// controller to add film to watch list, takes in userId and a filmId to add
const addUserFilmToWatch = async (req: Request, res: Response) => {
    try {
        const {userId, filmId} = req.body;

        const parsedUserId = parseInt(userId as string);
        const parsedFilmid = parseInt(filmId as string);
        if (isNaN(parsedUserId) || isNaN(parsedFilmid)) {
            return res.status(400).send({message: "Invalid ID"});
        }

        // sends data to db function
        await watchlist.addUserFilmToWatch(parsedUserId, parsedFilmid);
        res.status(200).send({message: "Film added to watch list successfully"});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

// controller to handle requests for removing movies from watch list
const removeUserFilmToWatch = async (req: Request, res: Response) => {
    try {
        const {userId, filmId} = req.body;

        const parsedUserId = parseInt(userId as string);
        const parsedFilmid = parseInt(filmId as string);
        if (isNaN(parsedUserId) || isNaN(parsedFilmid)) {
            return res.status(400).send({message: "Invalid ID"});
        }

        await watchlist.removeUserFilmToWatch(parsedUserId, parsedFilmid);
        res.status(200).send({message: "Film removed from watch list successfully"});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

// controller for handling reuests to get a users watchlist
const getUserFilmsToWatch = async (req: Request, res: Response) => {
    const {userId} = req.query;

    try {
        const parsedUserId = parseInt(userId as string);
        if (isNaN(parsedUserId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }

        const filmsToWatch = await watchlist.getUserFilmsToWatch(parsedUserId);
        res.status(200).send({message: "Films to watch fetched successfully", filmsToWatch});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

// controller to get a CSV export of a users watch list
// returns CSV content of the user's watch list
const getCSVUserFilmsToWatch = async (req: Request, res: Response) => {
    const {userId} = req.query;

    try {
        const parsedUserId = parseInt(userId as string);
        if (isNaN(parsedUserId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }

        const filmsToWatch = await watchlist.getUserFilmsToWatch(parsedUserId);
        const csvFilms = convertToCSV(filmsToWatch);

        // Set filename for the CSV file
        const filename = `user-${parsedUserId}-watchlist.csv`;

        // Set headers to inform the browser that this is a file download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        // Send the CSV file content
        res.status(200).send(csvFilms);
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

// controller to get a user's watched films
const getUserWatchedFilms = async (req: Request, res: Response) => {
    const {userId} = req.query;

    try {
        const parsedUserId = parseInt(userId as string);
        if (isNaN(parsedUserId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }

        const watchedFilms = await watchlist.getUserWatchedFilms(parsedUserId);

        res.status(200).send({message: "Watched Films fetched successfully", watchedFilms});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

export default {
    addUserFilmToWatch,
    getCSVUserFilmsToWatch,
    removeUserFilmToWatch,
    getUserFilmsToWatch,
    getUserWatchedFilms
};
