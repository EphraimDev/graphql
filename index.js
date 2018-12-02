import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import DataLoader from 'dataloader';
import _ from 'lodash';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import {refreshTokens} from './auth';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const SECRET = 'mysecret';

const app = express();

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "https://57ddb062.ngrok.io/auth/facebook/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    // 2 cases
    // Case 1: First time login
    //Case 2: other times
    const {id, displayName} = profile;
    console.log(id)
    const fbUsers = await models.fb_auths.findAll({
      Limit: 1,
      where: {fbId: id},
    });
    console.log(fbUsers);
    if(!fbUsers.length) {
      const user = await models.Users.create();
      const fbUser = await models.fb_auths.create({
        fbId: id,
        displayName,
        userId: user.userId
      })
    }
    cb(null, {})
  } 
));

app.use(passport.initialize());

app.get('/flogin', passport.authenticate('facebook'));
 
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    res.send('Aunthenticated');
  });
app.get('/', (req,res)=> {
  res.json({
    1:1
  })
})
const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if(token) {
    try {
      const {user} = await jwt.verify(token, SECRET);
      req.user = user
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET
      );
      if(newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user
    }
  }
  next();
};

app.use(cors('*'));
app.use(addUser);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
);

const batchComments = async (keys, {Comment}) => {
  const comments = await Comment.findAll({
    raw: true,
    where: {
      articleId: {
        $in: keys
      }
    }
  });
  const gs = _.groupBy(comments, articleId);

  return keys.map(k => gs[k] || [])
}

app.use('/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      SECRET,
      user: req.user,
      commentLoader: new DataLoader(keys => batchComments(keys, models)),
    }
  }))
);

const PORT = 7000;
const server = createServer(app);
server.listen(PORT, () => {
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server,
    path: '/subscriptions'
  });
  // eslint-disable-next-line no-console
   console.log('Server runs on 7000');
});

// app.listen(7000, () => {
//   // eslint-disable-next-line no-console
//   console.log('Server runs on 7000');
// });
