const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const personsRouter = require("./controllers/persons");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.morganConfig);

app.use("/api/persons", personsRouter);

app.use(middleware.unknownEndpoint);
// this has to be the last loaded middleware.
app.use(middleware.errorHandler);

module.exports = app;
