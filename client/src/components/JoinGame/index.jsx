import React, { useState } from "react";
import "../../App.css";
import { sanitize } from "../../utils";

export default function JoinGame({ socket, username, room, setRoom }) {
  const [show, setShow] = useState(false);
  const [roomInput, setRoomInput] = useState("");

  // if we don't want the room on refresh function, comment the useEffect
  // useEffect(() => {
  //   if (socket) {
  //     const savedRoom = localStorage.getItem("room");
  //     if (savedRoom) joinRoom(savedRoom);
  //   }
  // }, [socket]);

  const joinRoom = (name) => {
    socket.emit("join-game", name, room, username, (success, newRoom) => {
      setRoom(newRoom);
      localStorage.setItem("room", newRoom);
    });
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    // let r = roomInput.trim();
    let r = sanitize(roomInput);
    if (r !== "" && r !== room) joinRoom(r);
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
            className="join-game-button is-warning"
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
          <form className="modal-content" onClick={(e) => e.stopPropagation()}>
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
    </>
  );
}
