import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes";

// express application
const app = express();

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// localhost app runs on port 3000
const port = process.env.PORT || 3000;

// start server
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

// route handler for api requests
app.use("/api", routes);

export default app;
