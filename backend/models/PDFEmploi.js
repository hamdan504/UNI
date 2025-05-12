const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PDFEmploi = sequelize.define('PDFEmplois', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB,
    allowNull: false
  }
});

module.exports = PDFEmploi;
