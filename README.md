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
    - Create a new Database in MySQL called MovieRecap
    - Then drag and drop movie-recap-dump-POPULATED.sql into MySQL and run the script
    - movie-recap-dump-NOT-POPULATED.sql is there for easier grading, lighter file size, won't lag computer because there are over 200,000 entries in the POPULATED sql
    - Database should be populated and ready to go.
6. View commands to run by typing in `npm run`
7. On the first start type in `npm run build` to build the server
8. To run the server in development mode, type `npm run dev`

## Use in collation with Unity Game

1. To run Unity Game, open the MOVIE_BUILD.app executable inside the game folder (in vscode it may show as folder with contents)
2. We discluded the Source of the game because its around 500MB so it might take a while to download
    - if you would like to view the source of the game, here's the repo link
    - https://github.com/QuillanGee/Movie_Recap_Final_Submission/
3. Tip, to get the app started from the character moving around bit, press "/" (slash)

## Navigate the project structure with the following guidelines.

-   sql folder
    -   contains sql dump files
        -   contains populated and non populated
        -   non populated easier to read and grade
        -   populated used to import into mysql for functional app
-   game folder - includes a compiled MOVIE BUILD.app to run the game
-   controller folder
    -   responsible for handling specific endpoints and mapping them to db functions and returning data to a caller.
-   db folder
    -   responsible for handling direct communication to MySQL database
-   middlewares folder
    -   verifies RESTful data is of appropriate format
-   routes folder
    -   handles mapping specific api endpoints to appropriate controller functions.
