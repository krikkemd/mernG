import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.REACT_APP_APOLLO_SERVER_URI,
  cache: new InMemoryCache({
    // addTypename: false,
  }),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
