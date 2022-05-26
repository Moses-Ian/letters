// import React from 'react';
// import "./App.css";
// import LandingPage from './components/LandingPage';
// import Register from '../src/components/Register';


import React, { useState, useEffect } from "react";



import Room from "./components/Room";
import Header from "./components/Header";

import "./App.css";
import LandingPage from "./components/LandingPage";
import { io } from "socket.io-client";

import Auth from "./utils/auth";

//graphql
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// end graphql

function App() {
  const attachListeners = (socket) => {
    socket.on("connect", () => {
      console.log(`You connected with id: ${socket.id}`);
    });
  };

  // const [currentPage, setCurrentPage] = useState('LandingPage');

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3001`);
    attachListeners(newSocket);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);
	
	const username = Auth.getProfile().data.username;	//updates on refresh

  return (
    <ApolloProvider client={client}>
			<div className="App">
				<h1 style={{color: 'yellow'}}>Welcome, {username}!</h1>
				<LandingPage />
				<Header />
				<Room socket={socket}></Room>
				
			</div>
    </ApolloProvider>
  );
}

export default App;
