import React from "react";
import swipeRight from "../../assets/images/swipe-left7.png";
import settings from "../../assets/images/settings.png";
import share from "../../assets/images/share.png"
import { useMutation } from '@apollo/client';
import { SHARE_LOBBY_BY_EMAIL } from '../../utils/mutations';
import { useApolloClient } from '@apollo/client';

const Lobby = ({ room, players, activePlayer, display }) => {
	
	const client = useApolloClient();
	
	// const [sendEmail] = useMutation(SEND_EMAIL, { client });
	const [shareLobbyByEmail] = useMutation(SHARE_LOBBY_BY_EMAIL);
	
	const onShare = async () => {
		//sends the email once the 'to' field has been filled
		//clicking the button should open up a modal first
		console.log('share');
		
		const to = ['infestedian@gmail.com'];	// to be filled by user -> MUST VALIDATE
		const from = 'epsilon.studios@l3tters.com';
		const message = 'Sent from the client';
		
		try {
			const response = await shareLobbyByEmail({ 
				variables: {
					room,
					to
				}
			});
			console.log(response);
		} catch (err) {
			console.log(err);
		};
	};
	
	
	
	
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
					<p className="wotd">WORD OF THE DAY!!<span className="bonus"> 5 bonus points if you find this word</span></p>
					<button className="settings"><img src={settings} alt="Settings"/><span>Settings</span></button>
					<button className="share" onClick={onShare}><img src={share} alt="Share"/><span>Share</span></button>
					<p className="swipe-arrows">Swipe to play <span className="arrow-image"><img src={swipeRight} alt="right arrow"/></span></p>
			</div>
		</div>
  );
};

export default Lobby;
