// studentModel.js
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

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
  password: String,
});
studentSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Replace the plaintext password with the hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;