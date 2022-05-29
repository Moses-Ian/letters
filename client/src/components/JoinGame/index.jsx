import React, { useState } from "react";
import Modal2 from "../Modal-2";
import MainGame from "../MainGame";
import LiveChat from "../LiveChat";
import "../../App.css";

export default function JoinGame({ socket, username }) {
  const [show, setShow] = useState(false);
  const [room, setRoom] = useState("");

  const joinRoom = (name) => {
    socket.emit("join-game", name, room, (success, newRoom) => {
      setRoom(newRoom);
    });
    console.log(`joinRoom ${name}`);
  };

  const joinRoomHandler = () => {
    joinRoom("New Room");
    setShow(false);
  };

  return (
    <>
      <div className="field m-6 has-text-centered">
        {room == "" ? (
          <button
            className="join-game-button button is-warning"
            onClick={() => setShow(true)}
          >
            Join as {username}
          </button>
        ) : (
          ""
        )}
      </div>

      <Modal2
        title="Join Game"
        onClose={() => setShow(false)}
        show={show}
        joinRoomHandler={joinRoomHandler}
      >
        <div>
          <p className="join-modal-body">
            What is the name of the room you would like to join?
            <input
              className="type-box mt-2"
              type="text"
              placeholder="Type room name"
            />
          </p>
        </div>
      </Modal2>

      {room !== "" ? (
        <>
          <MainGame socket={socket} username={username} room={room} />
          <LiveChat socket={socket} username={username} room={room} />
        </>
      ) : (
        <p>You need to type a room name</p>
      )}
    </>
  );
}
