const mongoose = require("mongoose");

// Définition du schéma pour les PDF de la page "notes"
const pdfSchemaNotes = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

// Création du modèle à partir du schéma pour les PDF de la page "notes"
const PDFNotes = mongoose.model("PDFNotes", pdfSchemaNotes);

module.exports = PDFNotes;
