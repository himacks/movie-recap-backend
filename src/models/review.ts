// object type for review, includes optional parameter of movie so we can
// aggregate the movie data with the review if needed

import {Movie} from "./movie";

export interface Review {
    id: number;
    film_id: number;
    film?: Movie;
    user_id: number;
    comments: string;
    Action?: number;
    Adventure?: number;
    Animation?: number;
    Comedy?: number;
    Crime?: number;
    Drama?: number;
    Fantasy?: number;
    Family?: number;
    Fiction?: number;
    International?: number;
    Horror?: number;
    Mystery?: number;
    Romance?: number;
    SciFi?: number;
    Thriller?: number;
    TeleFilm?: number;
    Documentary?: number;
    History?: number;
    Music?: number;
    War?: number;
    Western?: number;
}
