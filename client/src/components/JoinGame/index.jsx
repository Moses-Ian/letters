import React, { useState } from "react";
import Modal2 from "../Modal-2";
import "../../App.css";


export default function JoinGame({username}) {
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
              Enter whatever body we need in here/ Create another Modal for Game
              so can remove buttons, maybe another one for register also
            </p>
          </div>
        </Modal2>
      
    </>
  );
}
