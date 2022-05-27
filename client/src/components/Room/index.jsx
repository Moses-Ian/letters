import React, { useState } from "react";
import MainGame from "../MainGame";
import Header from "../Header";
import LiveChat from "../LiveChat";

function Room({ socket, username }) {
  const [room, setRoom] = useState("");

  const joinRoom = (name) => {
    socket.emit("join-game", name, room, (success, newRoom) => {
      setRoom(newRoom);
    });
    console.log(`joinRoom ${name}`);
  };

  const joinRoomHandler = () => {
    joinRoom("New Room");
  };

  console.log("Room rendered");

  return (
    <div>
      <Header />
      <button className="game-btn" onClick={joinRoomHandler}>
        Join Game
      </button>

      <h1>You are playing in: {room}</h1>

      {room !== "" ? (
        <>
          <MainGame socket={socket} username={username} room={room} />
          <LiveChat socket={socket} username={username} room={room} />
        </>
      ) : (
        <p>You need to type a room name</p>
      )}
    </div>
  );
}

export default Room;
