import React, { useState } from "react";
import Lobby from "../Lobby";
// import Modal from "../Modal";


export default function Menu ({ socket, username, room, players, activePlayer, display }){
  const [show, setShow] = useState(false);

  return (
    <div className="menu">
      <button className="modal-toggle-button is-warning menu-button" onClick={() => setShow(true)}>
        Menu
      </button>


    {show &&
      <div hideEnterButton={true} onClose={() => setShow(false)}>
        
        <div className="modal-main">
          <div className="menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 className="modal-title">Menu</h4>
            </div>

            <div className="modal-body">
              <Lobby
              socket={socket}
              username={username}
              room={room}
              players={players}
              activePlayer={activePlayer}
              display={'active-view'}
              /> 
            </div>

            <div className="modal-footer">
              <button onClick={() => setShow(false)} className="modal-close-button">
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
      }
    </div>
  );
};


// export default Menu;