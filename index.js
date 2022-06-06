const express = require("express");
const app = express();
const port = 3001;
const persons = require("./data");

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
