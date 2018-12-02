'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fb_auths', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fb_auths');
  }
};