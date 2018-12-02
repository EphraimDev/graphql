import Sequelize from 'sequelize';

export default (sequelize) => {
  const Users = sequelize.define('Users', {
    userId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {});
  Users.associate = (models) => {
    // associations can be defined here
    Users.hasOne(models.Profiles, {
      foreignKey: 'userId',
      as: 'Profiles',
    });
    Users.hasMany(models.Trainings, {
      foreignKey: 'userId',
      as: 'Trainings',
    });
    Users.hasMany(models.ProductsBought, {
      foreignKey: 'userId',
      as: 'ProductsBought',
    });
    Users.hasMany(models.Comments, {
      foreignKey: 'userId',
      as: 'Comments',
    });
  };
  return Users;
};
