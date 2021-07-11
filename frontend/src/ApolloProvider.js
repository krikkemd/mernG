import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// credentials: 'same-origin' if your backend server is the same domain
// credentials: 'include' if your backend is a different domain.
const client = new ApolloClient({
  // credentials: 'same-origin',
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
