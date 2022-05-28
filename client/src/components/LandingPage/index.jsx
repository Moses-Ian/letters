import React, { useState } from "react";
import "../../App.css";
import JoinGame from "../JoinGame";
import Room from "../Room";
import Login from "../Login";
import Register from "../Register";
import HostGame from "../HostGame";

function LandingPage({ socket, username }) {
  const [room, setRoom] = useState("");

  const renderButtons = () => {
    if (username === "Guest") {
      return (
        <div className="column">
          <Login />
          <Register />
          <div>
            <div className="center">
              <h1 className="landing-letters">
                L<span className="landing-letters-3">3</span>tters
              </h1>
            </div>
          </div>
        </div>
      );
    } else {
      console.log("Registered user");

      return (
        <div className="column">
          <Room socket={socket} username={username}></Room>
          {/* <HostGame /> */}
        </div>
      );
    }
  };

  if (username !== "Guest") {
  }

  return (
    <>
      <div>{renderButtons()}</div>
      <div>
        <JoinGame
          socket={socket}
          username={username}
          room={room}
          setRoom={setRoom}
        />
      </div>
    </>
  );
}

export default LandingPage;
