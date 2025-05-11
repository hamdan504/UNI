const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cin: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  numeroInscription: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  dateNaissance: DataTypes.DATE,
  lieuNaissance: DataTypes.STRING,
  sexe: DataTypes.STRING,
  codePostal: DataTypes.STRING,
  adresseLocale: DataTypes.STRING,
  telephonePersonnel: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  specialite: DataTypes.STRING,
  niveauEtudes: DataTypes.STRING,
  groupeTD: DataTypes.STRING,
  etablissementAuPrecedente: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Student;
