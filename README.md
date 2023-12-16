## Prerequisites

Before you begin, ensure you have met the following requirements:

-   You have a `Node.js` environment installed on your computer.
    -   if you have homebrew on your mac you can type `brew install node`
    -   if you have windows go here -> https://nodejs.org/en/download/

## Installation

To install the project, follow these steps:

1. Clone the repository:
2. Navigate to the project directory
3. Install requirements by typing in `npm install`
4. Ensure you have configured the src/config/db.ts with proper routing to
   your MySQL server.
5. Ensure MySQL server is setup and filled with dump data (see sql folder for dump files)
6. View commands to run by typing in `npm run`
7. To run the server in development mode, type `npm run dev`

## Use in collation with Unity Game

## Navigate the project structure with the following guidelines.

-   controller folder
    -   responsible for handling specific endpoints and mapping them to db functions and returning data to a caller.
-   db folder
    -   responsible for handling direct communication to MySQL database
-   middlewares folder
    -   verifies RESTful data is of appropriate format
-   routes folder
    -   handles mapping specific api endpoints to appropriate controller functions.
