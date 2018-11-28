import Sequelize from 'sequelize';

export default (sequelize) => {
  const Profile = sequelize.define('Profiles', {
    profileId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    packages_bought: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    courses_taken: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    investment: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    zip: {
      type: Sequelize.INTEGER,
      allowNull: true,
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
  return Profile;
};
