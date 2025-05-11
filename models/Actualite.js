const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Actualite = sequelize.define('Actualite', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  publicCible: {
    type: DataTypes.STRING
  },
  imageURL: {
    type: DataTypes.STRING
  }
});

module.exports = Actualite;
