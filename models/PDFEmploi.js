const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PDFEmploi = sequelize.define('PDFEmploi', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  }
});

module.exports = PDFEmploi;
