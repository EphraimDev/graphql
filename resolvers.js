import randomString from 'random-string';
import UUID from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { PubSub } from 'graphql-subscriptions';
import { requiresAdmin, requiresAuth } from './permissions';
import {refreshTokens, tryLogin} from './auth';

export const pubsub = new PubSub()

const userToken = randomString({
  length: 8,
  numeric: true,
  letters: true,
  special: false
});

const uuidv4 = UUID.v4();

const USER_ADDED = 'USER_ADDED';

export default {
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(USER_ADDED)
    },
  },
  User: {
    profile: ({userId}, args, {models}) => models.Profiles.findAll({
      where: {
        userId
      }
    }),
    comments: ({userId}, args, {models}) => {
      models.Comments.findAll({
        where: {
          userId
        }
      })
    }
  },

  Article: {
    comments: ({articleId}, args, {commentLoader}) => 
    commentLoader.load(articleId)
  },

  // Comment: {
  //   creator: ({id}, args, {models}) => {
  //     console.log(1)
  //     return models.Users.findOne({
  //       where: {
  //         userId: id
  //       }
  //     })
  //   },
  // },

  Query: {
    allUsers: (parent, args, { models }) => models.Users.findAll(),
    me: (parent, args, { models, user }) => {
      if(user) {
        // user is logged in
        return models.Users.findOne({
          where: {
            userId: user.userId,
          },
        })
      }
      // not logged in
      return null
      
    },
    getProfile: (parent, {userId}, {models}) => models.Profiles.findOne({
      where: {
        userId
      }
    }),
    allArticle: (parent, args, { models }) => models.Articles.findAll(),
    getArticle: (parent, {articleId}, {models}) => models.Articles.findOne({
      where: {
        articleId
      }
    }),
  },
 
  Mutation: {
    createUser: async (parent, args, {models}) => {
      const user = args;
      //user.password = await bcrypt.hash(user.password, 10);
      user.password = 'idk';
      const userAdded = await models.Users.create(user);
      pubsub.publish(USER_ADDED, {
        userAdded
      });
      return userAdded
    },
    register: async (parent, args, { models }) => {
      const user = _.pick(args, ['fullname', 'isAdmin']);
      const localAuth = _.pick(args, ['email', 'password'])
      const passwordPromise = bcrypt.hash(localAuth.password, 10);
      const createUserPromise = models.Users.create(user);
      const [password, createdUser] = await Promise.all([passwordPromise, createUserPromise]);
      localAuth.password = password;
      return models.local_auths.create({
        ...localAuth,
        userId: createdUser.userId
      });
      // const foundUser = await models.Users.findOne({
      //   where: {
      //     email: user.email
      //   }
      // });
      // if(!foundUser) {
      //   user.password = await bcrypt.hash(user.password, 10);
      //   return models.Users.create(user)
      // } else {
      //   throw new Error('User already exists');
      // }
    },
    login: async (parent, {email, password}, {models, SECRET}) =>
      tryLogin(email, password, models, SECRET),
    refreshTokens: async (parent, {token,refreshToken}, {models, SECRET}) => 
      refreshTokens(token, refreshToken, models, SECRET),
    updateUser: (parent, args, { models }) => models.Users.update({ args }),
    deleteUser: (parent, args, { models }) => models.Users.destroy({ where: args }),
    createProfile: requiresAuth.createResolver((parent, {
      address, city, state, zip, userId
    }, { models }) => models.Profiles.create({
      address, city, state, zip, userId, profileId: uuidv4
    })),
    createArticle: requiresAdmin.createResolver((parent, 
      //{title, image, article,},
      args, 
      { models }) => models.Articles.create(args)),
    createComment: requiresAuth.createResolver((parent, 
      //{title, image, article,},
      args, 
      { models }) => {
        const comment = args;
        console.log(comment)
        models.Articles.findOne({
        where: {
          articleId: comment.articleId
        }
      })
      .then(article => {
        console.log(article)
        if(!article) {
          throw new Error('Article does not exist')
        }
        return models.Comments.create(comment)
      })
    }),
        
        
  },
};
