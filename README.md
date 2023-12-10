## Prerequisites

Before you begin, ensure you have met the following requirements:

-   You have a `Node.js` environment installed on your computer.
    -   if you have homebrew on your mac you can type `brew install node`

## Installation

To install the project, follow these steps:

1. Clone the repository:
2. Navigate to the project directory
3. Install requirements by typing in `npm install`
4. View commands to run by typing in `npm run`
5. Usually you'd run `npm run dev`

## API Documentation for Movie Application

Base URL: http://localhost:3000/api/v1/

## Endpoints

## Movies

### Search Movies

GET /movies/search
Query Parameters:
name (optional): Search movies by name.
id (optional): Get a movie by its ID.
Returns a list of movies or a specific movie based on the query parameters.

### Search Movies by Genre and Score

GET /movies/genre
Query Parameters:
genre1, genre2, genre3 (optional): Search movies by up to three genres.
limit (optional): Limit the number of results returned.
Returns a list of movies filtered by specified genres and score limits.

### Get Movie Details

GET /movies/details
Query Parameters:
id: The ID of the movie for which details are requested.
Returns detailed information of a movie, including actors, directors, and reviews.

## Reviews

### Add New Review

POST /reviews/add
Body: JSON object containing review details (film_id, user_id, score, etc.).
Adds a new review to the database.

### Get Reviews

GET /reviews
Query Parameters:
film_id (optional): Fetch reviews for a specific film.
user_id (optional): Fetch reviews by a specific user.
Returns a list of reviews based on the query parameters.

## Users

### User Signup

POST /users/signup

Body: JSON object containing user details (username, password, etc.).
Registers a new user in the database.

### User Login

POST /users/login

Body: JSON object containing user credentials (username, password).
Authenticates a user and returns user details.

## Watchlist

### Add Film to Watchlist

POST /watchlist/add

Body: JSON object containing user and film IDs (userId, filmId).
Adds a film to the user's watchlist.

### Remove Film from Watchlist

DELETE /watchlist/remove

Body: JSON object containing user and film IDs (userId, filmId).
Removes a film from the user's watchlist.

### Get User's Films to Watch

GET /watchlist

Query Parameter:
userId: The ID of the user.
Returns a list of films in the user's watchlist.

### Get User's Watched Films

GET /watchlist/watched
Query Parameter:
userId: The ID of the user.
Returns a list of films that the user has watched.

## Using Postman for Testing

Set the base URL in Postman to http://localhost:3000/api/v1/.
Choose the appropriate HTTP method (GET, POST, DELETE) for the endpoint you are testing.
For endpoints requiring query parameters, add them in the URL or in the 'Params' section in Postman.
For endpoints requiring a request body, select 'Body', choose 'raw', and set the type to 'JSON (application/json)'. Enter the JSON data as per the endpoint's requirements.
Send the request and observe the response.

## Notes

Replace localhost:3000 with your server's address and port if different.
Ensure your local server is running before testing with Postman.
For endpoints with optional parameters, omitting them will generally return broader results or default behavior.
