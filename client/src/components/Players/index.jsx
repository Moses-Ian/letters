
import React from "react";

const Players = ({players, activePlayer}) => {

	return (
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
								? "highlight"
								: "not-active")
						}
						key={index}
					>
						- {player.username} {player.score} points
					</li>
				))}
			</ul>
		</div>
	);
};

export default Players;