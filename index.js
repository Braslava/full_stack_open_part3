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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
