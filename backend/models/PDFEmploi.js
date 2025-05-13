import { DataTypes } from 'sequelize';

const PDFEmploi = (sequelize) => {
  return sequelize.define('PDFEmploi', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
};

export default PDFEmploi;
