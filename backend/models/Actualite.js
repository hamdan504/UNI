const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Actualite = sequelize.define('Actualite', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  publicCible: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageURL: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'Actualites'
});

module.exports = Actualite;
