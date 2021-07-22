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

import { getAccessTokenFromMemory } from './util/accessToken';

const httpLink = createHttpLink({
  credentials: 'include',
  uri: process.env.REACT_APP_APOLLO_SERVER_URI,
});

const authLink = setContext((_, { headers }) => {
  // accesToken is set after successful login, so we get it here, and add it to the headers for every next http request
  const accessToken = getAccessTokenFromMemory();
  console.log(`accessToken: ${accessToken}`);
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : 'NO ACCESSTOKEN PROVIDED',
    },
  };
});

// credentials: 'same-origin' if your backend server is the same domain
// credentials: 'include' if your backend is a different domain.
const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache({
    // addTypename: false,
    typePolicies: {
      Post: {
        fields: {
          likes: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
