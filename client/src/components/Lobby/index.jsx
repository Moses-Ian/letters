import React from "react";
import swipeRight from "../../assets/images/swipe-left7.png";

const Lobby = ({ room, players, activePlayer, display }) => {
  return (
		<div className={`view ${display}`}>
			<div className="is-flex is-flex-direction-column is-justify-content-center">
				<h1 className="room-name has-text-centered is-size-4">
					You are playing in: {room}
				</h1>

				<div className="players is-align-self-center">
					<div>
						<h1 className="has-text-warning">Players:</h1>
					</div>
					<ul>
						{players.map((player, index) => (
							<li
								className={
									"playerLi " +
									(activePlayer === player.username
										? "active-player"
										: "not-active")
								}
								key={index}
							>
								- {player.username} {player.score} points
							</li>
						))}
					</ul>
				</div>
					<p className="swipe-arrows">Swipe to play <img src={swipeRight} alt="right arrow"/></p>
			</div>
		</div>
  );
};

export default Lobby;
