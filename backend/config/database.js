const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('Database Config:', {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

// Force sync and create default admin
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    await sequelize.sync({ alter: true }); // Use alter instead of force to preserve existing data
    
    // Create default admin if it doesn't exist
    const Admin = require('../models/Admin');
    const defaultAdmin = await Admin.findOrCreate({
      where: { username: 'aa' },
      defaults: {
        username: 'aa',
        password: 'aa'
      }
    });
    
    console.log('Database initialized with default admin');
  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

initializeDatabase();

module.exports = sequelize;