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

function App() {
  const attachListeners = (socket) => {
    socket.on("connect", () => {
      console.log(`You connected with id: ${socket.id}`);
    });
    // socket.on("add-letter", addLetter);
    // socket.on("append-word", appendWord);
    // socket.on("clear-letters", clearLetters);
    // socket.on("set-game-state", setGameState);
  };

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3001`);
    attachListeners(newSocket);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="App">
      <LandingPage />
      <Header />
      <Room socket={socket}></Room>
    </div>
  );
}

export default App;
