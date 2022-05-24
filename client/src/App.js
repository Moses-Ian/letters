import React, { useState, useEffect } from "react";
import MainGame from "./components/MainGame";
import Room from "./components/Room";
import Header from "./components/Header";
// import React, { useState } from 'react';
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
  // let socket = io();	//front is same domain as server
  // let socket = io("http://localhost:3001"); //local
  // attachListeners(socket);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3001`);
    attachListeners(newSocket);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="App">
      <Header />

      {/* <MainGame room={room} /> */}
      <MainGame socket={socket} />

      <LandingPage />
    </div>
  );
}

export default App;
