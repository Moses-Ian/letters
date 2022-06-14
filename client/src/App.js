import React, { useState, useEffect, useReducer } from "react";
import { useSwipeable } from "react-swipeable";
import { io } from "socket.io-client";
import Auth from "./utils/auth";
import useWindowSize from "./utils/useWindowSize";
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
	
	const [isMobile, setMobile] = useState(true);
	useEffect(() => {
		setMobile(window.innerWidth <= 450);
	}, [window]);
	
	const [display, setDisplay] = useState('lobby');

	const swipeConfig = {
		delta: 10,                             // min distance(px) before a swipe starts. *See Notes*
		preventScrollOnSwipe: true,           // prevents scroll during swipe (*See Details*)
		trackTouch: true,                      // track touch input
		trackMouse: false,                     // track mouse input
		rotationAngle: 0,                      // set a rotation angle
		swipeDuration: Infinity,               // allowable duration of a swipe (ms). *See Notes*
		touchEventOptions: { passive: true },  // options for touch listeners (*See Details*)
	}
	
	const swipeHandlers = useSwipeable({
		onSwiped: (eventData) => console.log("User Swiped!", eventData),
		//once the winner system is in place, we'll make this more robust
		onSwipedLeft: (eventData) => setDisplay(display == 'lobby' ? 'game' : 'chat'),
		onSwipedRight: (eventData) => setDisplay(display == 'chat' ? 'game' : 'lobby'),
		...swipeConfig,
	});

	console.log('App.js rendered');
	// console.log(window.innerWidth, isMobile);

  return (
    <ApolloProvider client={client}>
      <div className="App container pt-3 pl-3 pr-3 pb-0" {...swipeHandlers}>
			{!loggedIn && room === "" ? (
          <LandingPage socket={socket} username={username} />
        ) : (
          <Header username={username} loggedIn={loggedIn} />
			)}
				{room === "" ? (
					<JoinGame
						socket={socket}
						username={username}
						room={room}
						setRoom={setRoom}
					/>
				) : (
          <Room 
						socket={socket} 
						username={username} 
						setUsername={setUsername}
						room={room}
						loggedIn={loggedIn}
						jwt={jwt}
						dailyHints={dailyHints}
						setDailyHints={setDailyHints}
						isMobile={isMobile}
						display={display}
					/>
        )}
      </div>
    </ApolloProvider>
  );
}

export default App;
