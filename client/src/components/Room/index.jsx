import React, { useState } from "react";
import MainGame from "../MainGame";

function Room({ socket }) {
  const [room, setRoom] = useState("");

  const joinRoom = (name) => {
    socket.emit("join-game", name, room, (success, newRoom) => {
      setRoom(newRoom);
    });
    console.log(`joinRoom ${name}`);
  };

  const joinRoomHandler = () => {
    joinRoom("My Cool Room");
  };

  return (
    <div>
      <button className="game-btn" onClick={joinRoomHandler}>
        Join Game
      </button>
      {room !== "" ? (
        <MainGame socket={socket} />
      ) : (
        <p>You need to type a room name</p>
      )}
    </div>
  );
}

export default Room;
