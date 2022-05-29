import React, { useState, useEffect } from "react";
import MainGame from "../MainGame";
import LiveChat from "../LiveChat";
import "../../App.css";

export default function JoinGame({ socket, username }) {
  const [show, setShow] = useState(false);
  const [room, setRoom] = useState("");
  const [roomInput, setRoomInput] = useState("");

  // if we don't want the room on refresh function, comment the useEffect
  useEffect(() => {
    if (socket) {
      const savedRoom = localStorage.getItem("room");
      if (savedRoom) joinRoom(savedRoom);
    }
  }, [socket]);

  const joinRoom = (name) => {
    socket.emit("join-game", name, room, username, (success, newRoom) => {
      setRoom(newRoom);
      localStorage.setItem("room", newRoom);
    });
    console.log(`joinRoom ${name}`);
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    let r = roomInput.trim();
    if (r != "" && r != room) joinRoom(roomInput);
    setShow(false);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setRoomInput(inputValue);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setShow(false);
  };

  return (
    <>
      <div className="field has-text-centered">
        {room === "" ? (
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

      {show ? (
        <div className="modal-main" onClick={closeModal}>
          <form className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Join Game</h4>
            </div>
            <div className="modal-body">
              <p className="join-modal-body">
                What is the name of the room you would like to join?
              </p>
              <input
                autoFocus
                className="type-box input mt-2"
                type="text"
                placeholder="Type room name"
                onChange={handleInputChange}
                value={roomInput}
              />
            </div>
            <div className="modal-footer">
              <input
                type="submit"
                className="modal-enter-button"
                value="Enter Game"
                onClick={joinRoomHandler}
              />
              <button className="modal-close-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </form>
        </div>
      ) : (
        ""
      )}

      {room !== "" ? (
        <>
          <MainGame socket={socket} username={username} room={room} />
          <LiveChat socket={socket} username={username} room={room} />
        </>
      ) : (
        // <p>You need to type a room name</p>
        ""
      )}
    </>
  );
}
