const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
});

const PDF = mongoose.model("PDF", pdfSchema);

module.exports = PDF;
