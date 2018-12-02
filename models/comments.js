import Sequelize from 'sequelize';

export default (sequelize) => {
  const Comments = sequelize.define('Comments', {
    commentId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Anonymous',
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    articleId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Articles',
        key: 'articleId',
        as: 'articleId',
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
          as: 'userId',
        }
      }
    },
  }, {});
  return Comments;
};
