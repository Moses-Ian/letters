import React from "react";
import Lobby from "../Lobby";


const Menu = ({ socket, username, room, players, activePlayer, display }) => {

  return (
		<div className="modal-main">
			<div className="menu-content" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h4 className="modal-title">Menu</h4>
				</div>

				<div className="modal-body"><Lobby
          socket={socket}
          username={username}
          room={room}
          players={players}
          activePlayer={activePlayer}
          display={'active-view'}
          /> 
        </div>

				 {/* footer added */}
          <div className="modal-footer">
					  <button className="modal-close-button">
						  Close
					  </button>
          </div>

				</div>
			</div>
  );
};


export default Menu;