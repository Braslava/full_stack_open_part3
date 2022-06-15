// This file is for development purposes only

const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://marab:${password}@cluster0.hh0lb.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
});

const Person = mongoose.model("Person", personSchema);

//if (process.argv.length < 4) {
// try {
//     await mongoose.connect(url);
//     const people = await Person.find({});
//     people.forEach((person) => {
//         console.log(person);
//     });
// } catch (err) {
//     console.log(err);
// } finally {
//     mongoose.connection.close();
// }
mongoose.connect(url);

if (name && number) {
    const person = new Person({
        name: name,
        number: number,
    });
    person
        .save()
        .then((result) => {
            console.log(`added ${name} number ${number} to phonebook`);
            return mongoose.connection.close();
        })
        .catch((err) => console.log(err));
}

if (process.argv.length < 4) {
    Person.find({})
        .then((persons) => {
            persons.forEach((person) => {
                console.log(person);
            });
            mongoose.connection.close();
        })
        .catch((err) => console.log(err));
}
