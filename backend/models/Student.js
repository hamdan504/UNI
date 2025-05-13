import { DataTypes } from 'sequelize';

const Student = (sequelize) => {
  return sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CIN: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    numeroInscription: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
};

export default Student;
