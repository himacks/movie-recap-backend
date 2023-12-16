import {Actor} from "./actor";
import {Director} from "./director";

// object type for user statistics

export interface UserStats {
    watchedCount: number;
    watchlistCount: number;
    favoriteActor: Actor | null;
    favoriteDirector: Director | null;
}
