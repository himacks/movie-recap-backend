// userFilmsController.ts
import {Request, Response} from "express";
import watchlist from "../db/watchlist";

const addUserFilmToWatch = async (req: Request, res: Response) => {
    try {
        const {userId, filmId} = req.body;
        await watchlist.addUserFilmToWatch(userId, filmId);
        res.status(200).send({message: "Film added to watch list successfully"});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

const removeUserFilmToWatch = async (req: Request, res: Response) => {
    try {
        const {userId, filmId} = req.body;
        await watchlist.removeUserFilmToWatch(userId, filmId);
        res.status(200).send({message: "Film removed from watch list successfully"});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

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

const getUserWatchedFilms = async (req: Request, res: Response) => {
    const {userId} = req.query;

    try {
        const parsedUserId = parseInt(userId as string);
        if (isNaN(parsedUserId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }

        const watchedFilms = await watchlist.getUserWatchedFilms(parsedUserId);
        res.status(200).send({message: "Watched films fetched successfully", watchedFilms});
    } catch (err) {
        res.status(500).send({message: "DATABASE ERROR", error: err});
    }
};

export default {
    addUserFilmToWatch,
    removeUserFilmToWatch,
    getUserFilmsToWatch,
    getUserWatchedFilms
};
