import randomString from 'random-string';
import UUID from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { PubSub } from 'graphql-subscriptions';

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
        userId: userId
      }
    })
  },
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
      const user = args;
      user.token = userToken
      const foundUser = await models.Users.findOne({
        where: {
          email: user.email
        }
      });
      if(!foundUser) {
        user.password = await bcrypt.hash(user.password, 10);
        return models.Users.create(user)
      } else {
        throw new Error('User already exists');
      }
    },
    login: async (parent, {email, password}, {models, SECRET}) => {
      models.Users.findOne({where:{email}})
      .then(user => {
        if(!user) {
          console.log('error')
          throw new Error('No user with that email')
        }

         bcrypt.compare(password, user.password)
        .then(valid => {
          if(!valid) {
            throw new Error('Incorrect password');
          }
    
          const token = jwt.sign(
            {
              user: _.pick(user, ['userId', 'email'])
            },
            SECRET,
            {
              expiresIn: '1y'
            }
          );
          const myToken = token;
          console.log(token);
          return myToken

        })
        .catch(err => {
          throw new Error('jwt did not work')
        })
        
      })
      .catch(err => {
        throw new Error('Login failed')
      })
    },
    updateUser: (parent, args, { models }) => models.Users.update({ args }),
    deleteUser: (parent, args, { models }) => models.Users.destroy({ where: args }),
    createProfile: (parent, {
      address, city, state, zip, userId
    }, { models }) => models.Profiles.create({
      address, city, state, zip, userId, profileId: uuidv4
    }),
    createArticle: (parent, {
      title, image, article,
    }, { models }) => models.Articles.create({
      title, image, article
    }),
  },
};
