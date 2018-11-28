import Sequelize from 'sequelize';

export default (sequelize) => {
  const Articles = sequelize.define('Articles', {
    articleId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    article: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {});
  Articles.associate = (models) => {
    // associations can be defined here
    Articles.hasMany(models.Comments, {
      foreignKey: 'articleId',
      as: 'Articles',
    });
  };
  return Articles;
};
