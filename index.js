const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
let persons = require("./data");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/build/"));

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
    res.json(persons);
});

app.get("/info", (req, res) => {
    const date = new Date();
    res.send(
        `<p>The phonebook has ${persons.length} entries</p><p>${date}</p>`
    );
});

app.get("/api/persons/:id", (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
        console.log(person);
    } else {
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);

    res.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    console.log(body);

    const numberExists = persons.find(
        (person) => person.number === body.number
    );
    console.log(numberExists);
    console.log(body);
    if (!body.name) {
        return response.status(400).json({
            error: "name missing",
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing",
        });
    } else if (numberExists) {
        return response.status(400).json({
            error: "number already exists",
        });
    }

    const generateId = () => {
        const id = Math.floor(Math.random() * 9000);
        console.log(id);
        return id;
    };

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };

    persons = persons.concat(person);
    response.json(person);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
