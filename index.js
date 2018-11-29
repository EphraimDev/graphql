import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const SECRET = 'mysecret';

const app = express();

const addUser = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const {user} = await jwt.verify(token, SECRET);
    req.user = user

  } catch (err) {
    console.log(err)
  }
  req.next();
};

app.use(cors('*'));
app.use(addUser);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
);

app.use('/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      SECRET,
      user: req.user
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
