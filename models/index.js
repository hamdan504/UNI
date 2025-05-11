const Student = require('./Student');
const Admin = require('./Admin');
const Actualite = require('./Actualite');
const PDFNotes = require('./PDFNotes');
const PDFEmploi = require('./PDFEmploi');

// Add any model associations here if needed
// Example: Student.hasMany(PDFNotes);

module.exports = {
  Student,
  Admin,
  Actualite,
  PDFNotes,
  PDFEmploi
};
