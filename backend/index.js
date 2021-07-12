const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  const app = express();

  // Additional middleware can be mounted at this point to run before Apollo.
  // app.use('*', jwtCheck, requireAuth, checkScope);

  // Mount Apollo middleware here.
  server.applyMiddleware({ app, path: '/specialUrl' });
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
