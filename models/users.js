import Sequelize from 'sequelize';

export default (sequelize) => {
  const Users = sequelize.define('Users', {
    userId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  }, {});
  Users.associate = (models) => {
    // associations can be defined here
    Users.hasOne(models.Profiles, {
      foreignKey: 'userId',
      as: 'Profiles',
    });
    Users.hasMany(models.Articles, {
      foreignKey: 'userId',
    });
    Users.hasMany(models.Comments, {
      foreignKey: 'userId',
      as: 'Comments',
    });
  };
  return Users;
};
