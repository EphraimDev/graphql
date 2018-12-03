import Sequelize from 'sequelize';

export default (sequelize) => {
  const LocalAuth = sequelize.define('local_auths', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
        as: 'userId',
      },
    },
  }, {});
  LocalAuth.associate = (models) => {
    // associations can be defined here
    LocalAuth.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
  };
  return LocalAuth;
};
