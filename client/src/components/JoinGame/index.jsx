import React, { useState } from "react";
import Modal2 from "../Modal-2";
import "../../App.css";

export default function JoinGame({ socket, username, room }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="container1">
        <div className="center1">
          <button className="join-game-button" onClick={() => setShow(true)}>
            {" "}
            Join as {username}{" "}
          </button>
        </div>
      </div>

      <Modal2 title="Join Game" onClose={() => setShow(false)} show={show}>
        <div>
          <p>
            {" "}
            What is the name of the room you would like to join?
            <input className="m-2" type="text" placeholder="Type room name" />
          </p>
        </div>
      </Modal2>
    </>
  );
}
