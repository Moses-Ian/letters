import React, { useState } from "react";
import Lobby from "../Lobby";
import Modal from "../Modal";


export default function Menu ({ socket, username, room, players, activePlayer, display, setRoom, deleteToken, loggedIn }){
  const [show, setShow] = useState(false);

  return (
    <div className="menu">
      <button className="l3tters-btn modal-toggle-button is-warning menu-button" onClick={() => setShow(true)}>
        Menu
      </button>


    {show &&
			<Modal title="Menu" onClose={() => setShow(false)} hideEnterButton={true}>
				<Lobby
					players={players}
					activePlayer={activePlayer}
					display={'active-view'}
				/> 
			</Modal>
		}
    </div>
  );
};