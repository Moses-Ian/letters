import React, { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { io } from "socket.io-client";
import Auth from "./utils/auth";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import JoinGame from "./components/JoinGame";
import Room from "./components/Room";
import { useMutation } from "@apollo/client";
import { EXTEND } from "./utils/mutations";
import useWindowSize from "./utils/useWindowSize";

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

const swipeConfig = {
  delta: 10, // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: true, // prevents scroll during swipe (*See Details*)
  trackTouch: true, // track touch input
  trackMouse: false, // track mouse input
  rotationAngle: 0, // set a rotation angle
  swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
};

function App() {
  const [socket, setSocket] = useState(null);
	const [username, setUsername] = useState('Guest');
	const [usernameReady, setUsernameReady] = useState(false);
	const [jwt, setJWT] = useState(null);
  const [room, setRoom] = useState("");
	const [display, setDisplay] = useState('game');
  const [extend] = useMutation(EXTEND, { client });
	const { width, height } = useWindowSize();
  const [isYourTurn, setTurn] = useState(false);

	const isMobile = (width <= 450);
	const loggedIn = Auth.loggedIn();
	const decodedToken = Auth.decodeToken(Auth.getToken())
	const dailyHints = decodedToken ? decodedToken.data.dailyHints : 0;
	
  const attachListeners = (socket) => {
    socket.on("connect", () => {
      console.log(`You connected with id: ${socket.id}`);
    });
  };

	const swipeHandlers = useSwipeable({
		// onSwiped: (eventData) => console.log("User Swiped!", eventData),
		onSwipedLeft:  (eventData) => setDisplay(display === 'lobby' ? 'game' : 'chat'),
		onSwipedRight: (eventData) => setDisplay(display === 'chat'  ? 'game' : 'lobby'),
		...swipeConfig,
	});

	const saveToken = useCallback((jwt) => {
		setJWT(jwt);
		Auth.login(jwt);
	}, []);
	
	const deleteToken = useCallback((jwt) => {
		setJWT(null);
		Auth.logout();
	}, []);

	const extendToken = async () => {
		try {
			const mutationResponse = await extend({
				headers: {
					authorization: Auth.getProfile()
				}
			});
			return mutationResponse.data.extend.token;
		} catch (err) {
			console.error(err.message);
			return null;
		}
	}

  const createSocket = () => {
    // const newSocket = io(`http://localhost:3001`);
    const newSocket = io(); //works in production and dev ???
    attachListeners(newSocket);
    setSocket(newSocket);
    return () => {
      socket.disconnect();
      newSocket.close();
    };
  }
	
	useEffect(() => {
		async function updateProfile() {
			const profile = Auth.getProfile();
			if (profile && Auth.loggedIn()) {
				const token = await extendToken();
				if (!token) {
					setUsernameReady(true);
					return;
				}
				const { data } = Auth.decodeToken(token);
				setUsername(data.username);
				setUsernameReady(true);
				saveToken(token);
			}
			setUsernameReady(true);
		};
		updateProfile();
		createSocket();
	// eslint-disable-next-line
	}, []);
	
	useEffect(() => {
		const decodedToken = Auth.decodeToken(jwt);
		if (!decodedToken) {
			setUsername('Guest');
			setUsernameReady(true);
			return;
		}
		setUsername(decodedToken.data.username);
		setUsernameReady(true);
	}, [jwt]);
	
	console.log('App.js rendered');

  return (
    <ApolloProvider client={client}>
      <div className="App container pt-3 pl-3 pr-3 pb-0" {...swipeHandlers}>
			{!loggedIn && room === "" ? (
          <LandingPage 
						socket={socket} 
						username={username} 
						saveToken={saveToken}
					/>
        ) : (
          <Header 
						username={username} 
						loggedIn={loggedIn} 
						deleteToken={deleteToken}
					/>
			)}
				{room === "" ? (
					<JoinGame
						socket={socket}
						username={username}
						setUsername={setUsername}
						usernameReady={usernameReady}
						room={room}
						setRoom={setRoom}
						width={width}
						height={height}
						setTurn={setTurn}
					/>
				) : (
          <Room 
						socket={socket} 
						username={username} 
						setUsername={setUsername}
						room={room}
						setRoom={setRoom}
						loggedIn={loggedIn}
						jwt={jwt}
						dailyHints={dailyHints}
						saveToken={saveToken}
						isMobile={isMobile}
						display={display}
						isYourTurn={isYourTurn}
						setTurn={setTurn}
					/>
        )}
      </div>
    </ApolloProvider>
  );
}

export default App;
