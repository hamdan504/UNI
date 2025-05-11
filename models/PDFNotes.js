const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PDFNotes = sequelize.define('PDFNotes', {
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

module.exports = PDFNotes;
