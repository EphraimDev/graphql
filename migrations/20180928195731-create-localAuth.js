'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LocalAuth', {
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
    return queryInterface.dropTable('LocalAuth');
  }
};