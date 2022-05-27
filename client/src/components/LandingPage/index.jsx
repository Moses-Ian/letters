import React from "react";
import "../../App.css";
import JoinGame from "../JoinGame";
import Room from "../Room";
import Login from "../Login";
import Register from "../Register";
import Auth from "../../utils/auth";
import HostGame from "../HostGame";

function LandingPage({ socket, username }) {
  
  

  const renderButtons = () => {
    if (username === "Guest") {
      console.log("Guest");
      return (
        <>
          <Login />
          <Register />
          <div className="container1">
            <h1 className="landing-letters">L<span className='landing-letters-3'>3</span>tters</h1>
          </div>
          <JoinGame />
        </>
      );
    } else {
      console.log("Registered user");
      return (
        <>
          <button className="modal-toggle-button" onClick={() => Auth.logout()}>
            Logout
          </button>
          <Room socket={socket} username={username}></Room>;
          {<Room /> ? (
            ""
          ) : (
            <>
              <HostGame />
              <JoinGame username={username}/> 
              
            </>
          )}
        </>
      );
    }
  };

  if (username !== "Guest") {
  }

  return <div>{renderButtons()}</div>;
}

export default LandingPage;
