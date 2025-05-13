import { Sequelize } from 'sequelize';
import path from 'path';
import PDFNotes from '../models/PDFNotes.js';
import PDFEmploi from '../models/PDFEmploi.js';
import Student from '../models/Student.js';
import Actualite from '../models/Actualite.js';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('Database Config:', {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

// Initialize all models
const models = {
  PDFNotes: PDFNotes(sequelize),
  PDFEmploi: PDFEmploi(sequelize),
  Student: Student(sequelize),
  Actualite: Actualite(sequelize),
  Admin: Admin(sequelize)
};

// Set up associations if needed
// models.Student.hasMany(models.PDFNotes);
// models.PDFNotes.belongsTo(models.Student);

export { sequelize, models };