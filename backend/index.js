const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { generateToken, generateRefreshToken } = require('./util/tokens');

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }), // destructure the req object from the incoming request and pass it to the context
  });
  await server.start();

  const app = express();

  // Additional middleware can be mounted at this point to run before Apollo.
  app.use(cookieParser());
  app.use(
    cors({
      origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
      credentials: true,
    }),
  );

  // Routes
  app.get('/', (req, res) => res.send('hello'));
  app.post('/refresh_token', async (req, res) => {
    // console.log(req.headers);
    console.log(req.cookies);

    // cookie has a jwt token stored inside (refresh_token)
    const refreshToken = req.cookies.refCookie; // we can access the token from thr refCookie because of cookieParser
    console.log(refreshToken); // The actual jwt inside the cookie

    // If there isnt a refresh token (cookie)
    if (!refreshToken) {
      console.log('REFRESH COOKIE NOT PRESENT ON HEADERS');
      return res.send({ accessToken: '', message: 'cookie not present' });
    }

    let payload; // the payload is whatever you stored in the refToken (userId)

    // There is a refCookie present, verify the refToken, check if it isnt expired.. or malformed
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (error) {
      console.log(error);
      return res.send({
        accessToken: '',
        error,
        message: 'cookie was present, but jwt verify failed',
      });
    }

    // refToken is VALID at this point

    console.log(payload.id); // payload === decodedToken = mongodb userId
    // refresh token is valid, we can send back an access token

    // Find the user using the userId from the decoded RefToken
    const user = await User.findOne({ _id: payload.id });

    if (!user) {
      return res.send({ accessToken: '', user: 'user is not found inside DB' });
    }

    // send a new refCookie, with a new refresh token, storing again, the userId
    res.cookie('refCookie', generateRefreshToken(user._id), {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 3600000), // 1 hour
    });

    console.log(user); // the user from the DB

    // Send back an accessToken, again with the user stored
    // We zouden ook de user al terug kunnen sturen hier ipv decoden client side
    return res.send({ accessToken: generateToken(user) });
  });

  // Mount Apollo middleware here.
  // server.applyMiddleware({ app, path: '/specialUrl' });
  server.applyMiddleware({ app, cors: false }); // DISABLE CORS FROM APOLLO FOR EXPRESS TO WORK!!!

  // await new Promise(resolve => app.listen({ port: 4000 }, resolve));

  //   // Connect to mongoDB, then start the server
  mongoose
    .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB!');
      app.listen(4000, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
      });
    });

  return { server, app };
}

startApolloServer();

// const { ApolloServer } = require('apollo-server-express');
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const typeDefs = require('./graphql/typeDefs');
// const resolvers = require('./graphql/resolvers');

// // pubsub is used for subscriptions (polling/sockets) we pass it to our context so we can acces it in our resolvers
// // const pubsub = new PubSub();

// (async () => {
//   const app = express();
//   // app.use(
//   //   cors({
//   //     origin: 'http://localhost:3000',
//   //     credentials: true,
//   //   }),
//   // );
//   app.use(cookieParser);

//   const apolloServer = new ApolloServer({
//     typeDefs,
//     resolvers,
//     // cors: true,
//     context: ({ req, res }) => ({ req, res }), // destructure the req object from the incoming request and pass it to the context
//   });

//   await apolloServer.start();

//   apolloServer.applyMiddleware({ app });

// //   // Connect to mongoDB, then start the server
//   mongoose
//     .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//       console.log('Connected to MongoDB!');
//       return app.listen({ port: 5000 });
//     })
//     .then(res => {
//       console.log(`Server running at ${res.url}`);
//     });
// })();
