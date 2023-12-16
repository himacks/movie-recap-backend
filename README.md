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
5. View commands to run by typing in `npm run`
6. Usually you'd run `npm run dev`

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

## To make your grading life easier here's what you can search for in the repository to get to each project requirement

1. Print/display records from your database/tables.

-   Check Unity Game, or see

2. Query for data/results with various parameters/filters

3. Create a new record

4. Delete records (soft delete function would be ideal)

5. Update records

6. Make use of transactions (commit & rollback)

7. Generate reports that can be exported (excel or csv format)

8. One query must perform an aggregation/group-by clause

9. One query must contain a subquery.

10. Two queries must involve joins across at least 3 tables

11. Enforce referential integrality (PK/FK Constraints)

12. Include Database Views, Indexes

13. Use at least 5 entities
