export interface Review {
    id: number;
    film_id: number;
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
