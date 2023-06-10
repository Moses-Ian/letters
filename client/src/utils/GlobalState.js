import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import useWindowSize from "./useWindowSize";
import { io } from "socket.io-client";
import Auth from "./auth";
import { useMutation } from "@apollo/client";
import { EXTEND } from "./mutations";

const L3ttersContext = createContext();
const { Provider } = L3ttersContext;

const L3ttersProvider = ({ value = {}, ...props }) => {
	// values -> it's redundant to destructure them like this, but WAY more readable
	const { room, setRoom, display, loggedIn, jwt, setJWT } = value;
	
	//states
	const { width, height } = useWindowSize();
  const [extend] = useMutation(EXTEND);
  const [socket, setSocket] = useState(null);
  const [isYourTurn, setTurn] = useState(false);
  const [round, setRound] = useState(1);
	const [username, setUsername] = useState('Guest');
	const [usernameReady, setUsernameReady] = useState(false);	//don't try to join a room until username is ready
	
	// constants
	const isMobile = (width <= 450);
	const decodedToken = Auth.decodeToken(Auth.getToken())
	const dailyHints = decodedToken ? decodedToken.data.dailyHints : 0;
	
	// socket stuff
  const attachListeners = (socket) => {
    socket.on("connect", () => {
      console.log(`You connected with id: ${socket.id}`);
    });
  };

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
	
	// token stuff
	const saveToken = useCallback((jwt) => {
		setJWT(jwt);
		Auth.login(jwt);
	// eslint-disable-next-line
	}, []);
	
	const deleteToken = useCallback((jwt) => {
		setJWT(null);
		Auth.logout();
	// eslint-disable-next-line
	}, []);

	const extendToken = async () => {
		console.log('extend token');
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
	
	
	//initialize the profile, socket, and install-listener
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
	
	// outputs
	const states = {
		width,
		height,
		isMobile,
		socket,
		username,
		setUsername,
		usernameReady,
		room,
		setRoom,
		loggedIn,
		dailyHints,
		jwt,
		saveToken,
		deleteToken,
		display,
		isYourTurn,
		setTurn,
		round,
		setRound,
	};

	return <Provider value={states} {...props} />
}

const useL3ttersContext = () => {
	return useContext(L3ttersContext);
};

export { L3ttersProvider, useL3ttersContext };