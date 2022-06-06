const express = require("express");
const app = express();
const port = 3001;
const persons = require("./data");

const date = new Date();

//console.log(persons);
app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
