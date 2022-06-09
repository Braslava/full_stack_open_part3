const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");
const { response } = require("express");
//let persons = require("./data");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

//app.use(morgan("tiny"));
morgan.token("body", function (req, res) {
    return JSON.stringify(req.body);
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

// requests

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.get("/info", (req, res) => {
    const date = new Date();
    Person.find({}).then((persons) => {
        res.send(
            `<p>The phonebook has ${persons.length} entries</p><p>${date}</p>`
        );
    });
});

app.get("/api/persons/:id", (req, res, next) => {
    console.log(req.params.id);
    Person.findById(req.params.id)
        .then((person) => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => {
            next(error);
        });
});

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.status(204).end();
        })
        .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
    const name = req.body.name;
    const number = req.body.number;
    console.log(name, number);

    Person.exists({ name: name }).then((nameExists) => {
        if (nameExists) {
            res.status(400).json({
                error: "This name is already in the phonebook",
            });
        }
    });    

    const person = new Person({
        name: name,
        number: number,
    });
    person
        .save()
        .then((savedPerson) => res.json(savedPerson))
        .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
    const name = req.body.name;
    const number = req.body.number;
    console.log(name, number);

    const person = {
        name: name,
        number: number,
    };
    Person.findByIdAndUpdate(req.params.id, person, {
        new: true,
        runValidators: true,
        context: "query",
    })
        .then((updatedPerson) => {
            res.json(updatedPerson);
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    }
    next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
