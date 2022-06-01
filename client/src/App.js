import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import { io } from "socket.io-client";
import Auth from "./utils/auth";
import Header from "./components/Header";
import JoinGame from "./components/JoinGame";
import Room from "./components/Room";


//graphql
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import NumbersGame from "./components/NumbersGame";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
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

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // const newSocket = io(`http://localhost:3001`);
    const newSocket = io(); //works in production and dev ???
    attachListeners(newSocket);
    setSocket(newSocket);
    return () => {
      socket.disconnect();
			newSocket.close();
		}
  }, [setSocket]);

  const profile = Auth.getProfile();
  const username = profile ? profile.data.username : "Guest"; //updates on refresh
  const [room, setRoom] = useState("");

  return (
    <ApolloProvider client={client}>
      <div className="App container p-3">
				{username === 'Guest' && room === ''
					? <LandingPage socket={socket} username={username} />
					: <Header username={username} /> 
				}
				
				<JoinGame
					socket={socket}
					username={username}
					room={room}
					setRoom={setRoom}
				/>
				{room !== "" ? (
					<Room
						socket={socket}
						username={username}
						room={room}
					/>
				) : (
					// <p>You need to type a room name</p>
					""
				)}
				
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
