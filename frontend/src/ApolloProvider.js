import React from 'react';
import App from './App';
import {
  ApolloClient,
  createHttpLink,
  concat,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { getAccessToken } from './util/accessToken';

const httpLink = createHttpLink({
  credentials: 'include',
  uri: process.env.REACT_APP_APOLLO_SERVER_URI,
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : 'NO TOKEN PROVIDED',
    },
  };
});

// credentials: 'same-origin' if your backend server is the same domain
// credentials: 'include' if your backend is a different domain.
const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache({
    // addTypename: false,
  }),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
