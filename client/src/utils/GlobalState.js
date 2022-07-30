import React, { useState, useEffect, createContext, useContext } from "react";
import useWindowSize from "./useWindowSize";
import { io } from "socket.io-client";

const L3ttersContext = createContext();
const { Provider } = L3ttersContext;

const L3ttersProvider = ({ value = [], ...props }) => {
	//states
	const { width, height } = useWindowSize();
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [isYourTurn, setTurn] = useState(false);
  const [round, setRound] = useState(1);
	
	// constants
	const isMobile = (width <= 450);
	
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
	
	useEffect(() => {
		createSocket();
	}, [])
	
	// outputs
	const states = {
		width,
		height,
		isMobile,
		socket,
		isYourTurn,
		setTurn,
		round,
		setRound
	};

	return <Provider value={states} {...props} />
}

const useL3ttersContext = () => {
	return useContext(L3ttersContext);
};

export { L3ttersProvider, useL3ttersContext };