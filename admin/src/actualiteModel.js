// actualiteModel.js
const mongoose = require("mongoose");

const actSchema = new mongoose.Schema({

    title: String,
    description : String,
    publicCible : String,
    date : String,
    imageURL : String,
});

const Actualite = mongoose.model("Actualite", actSchema);

module.exports = Actualite;
