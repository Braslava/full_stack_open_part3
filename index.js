const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");
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

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.get("/info", (req, res) => {
    const date = new Date();
    res.send(
        `<p>The phonebook has ${persons.length} entries</p><p>${date}</p>`
    );
});

app.get("/api/persons/:id", (req, res, next) => {
    console.log(req.params.id);
    Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);

    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const name = req.body.name;
    const number = req.body.number;
    console.log(name, number);
    // const nameExists = persons.find((person) => person.name === body.name);
    // console.log(nameExists);
    // console.log(body);
    if (!name) {
        return res.status(400).json({
            error: "name missing",
        });
    } else if (!number) {
        return res.status(400).json({
            error: "number missing",
        });
    }
    // } else if (nameExists) {
    //     return response.status(400).json({
    //         error: "name already exists",
    //     });
    // }
    const person = new Person({
        name: name,
        number: number,
    });
    person.save().then((savedPerson) => res.json(savedPerson));

    // persons = persons.concat(person);
    // console.log("newPerson", person);
    // response.json(person);
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
