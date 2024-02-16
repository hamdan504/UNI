// studentModel.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  cin: { type: String, unique: true },
  numeroInscription: String,
  dateNaissance: Date,
  lieuNaissance: String,
  sexe: String,
  codePostal: String,
  adresseLocale: String,
  telephonePersonnel: String,
  email: { type: String, unique: true },
  specialite: String,
  niveauEtudes: String,
  groupeTD: String,
  etablissementAuPrecedente: String,
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;