'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Profiles', {
      profileId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
        picture: {
          type: Sequelize.STRING,
          allowNull: true
        },
        address: {
          type: Sequelize.STRING,
          allowNull: true
        },
        state: {
          type: Sequelize.STRING,
          allowNull: true
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true
        },
        zip: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        userId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          allowNull: true,
          references: {
            model: 'Users',
            key: 'userId',
            as: 'userId'
          }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Profiles');
  }
};