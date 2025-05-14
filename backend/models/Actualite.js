import { DataTypes } from 'sequelize';

const ActualiteModel = (sequelize) => {
  const Actualite = sequelize.define('Actualite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
      defaultValue: DataTypes.NOW
    }
  });

  return Actualite;
};

export default ActualiteModel;