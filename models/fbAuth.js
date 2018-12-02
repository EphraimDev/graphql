import Sequelize from 'sequelize';

export default (sequelize) => {
  const FbAuth = sequelize.define('fb_auths', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    fbId: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    displayName: {
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
  FbAuth.associate = (models) => {
    // associations can be defined here
    FbAuth.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
  };
  return FbAuth;
};
