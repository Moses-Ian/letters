import React, { useState, useEffect, useReducer } from "react";
import { io } from "socket.io-client";
import Auth from "./utils/auth";
import LandingPage from "./components/LandingPage";
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
	const [username, setUsername] = useState('Guest');
	const [loggedIn, setLoggedIn] = useState(false);
	const [jwt, setJWT] = useState(null);
	const [dailyHints, setDailyHints] = useReducer(dailyHintReducer, 0);

	function dailyHintReducer(dailyHints, action) {
		let newDailyHints;
		switch (action.type) {
			case "DECREMENT":
				newDailyHints = dailyHints - 1;
				break;
			case "SET":
				newDailyHints = action.dailyHints;
				break;
			default:
				throw new Error();
		}
		return newDailyHints;
	};

  useEffect(() => {
    // const newSocket = io(`http://localhost:3001`);
    const newSocket = io(); //works in production and dev ???
    attachListeners(newSocket);
    setSocket(newSocket);
    return () => {
      socket.disconnect();
      newSocket.close();
    };
  }, [setSocket]);
	
  const profile = Auth.getProfile();
  const [room, setRoom] = useState("");

	useEffect(() => {
		if (profile) {
			setUsername(profile.data.username);
			setLoggedIn(Auth.loggedIn());
			setJWT(Auth.getToken());
			setDailyHints({type: "SET", dailyHints: profile.data.dailyHints});
			console.log(profile);
		}
	}, []);
	
	console.log('App.js rendered');

  return (
    <ApolloProvider client={client}>
      <div className="App container p-3">
        {!loggedIn && room === "" ? (
          <LandingPage socket={socket} username={username} />
        ) : (
          <Header username={username} loggedIn={loggedIn} />
        )}

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
						setUsername={setUsername}
						room={room}
						loggedIn={loggedIn}
						jwt={jwt}
						dailyHints={dailyHints}
						setDailyHints={setDailyHints}
					/>
        ) : (
          ""
        )}
      </div>
    </ApolloProvider>
  );
}

export default App;
