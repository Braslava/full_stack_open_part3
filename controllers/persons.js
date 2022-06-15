const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

personsRouter.get("/info", (req, res) => {
    const date = new Date();
    Person.find({}).then((persons) => {
        res.send(
            `<p>The phonebook has ${persons.length} entries</p><p>${date}</p>`
        );
    });
});

personsRouter.get("/:id", (req, res, next) => {
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

personsRouter.delete("/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch((err) => next(err));
});

personsRouter.post("/", (req, res, next) => {
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

personsRouter.put("/:id", (req, res, next) => {
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

module.exports = personsRouter;
