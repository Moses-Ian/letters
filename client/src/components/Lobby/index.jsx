import React from "react";
import swipeRight from "../../assets/images/swipe-left7.png";
import settings from "../../assets/images/settings.png";
import share from "../../assets/images/share.png"
// import friend from "../../assets/images/friend.png"
import dollar from "../../assets/images/dollar.png"
import { useMutation } from '@apollo/client';
import { SHARE_LOBBY_BY_EMAIL } from '../../utils/mutations';
import { validateEmail } from '../../utils';

import Friends from "../Friends"

//this is very cute and absolutely not necessary
const url = process.env.NODE_ENV === 'production' 
	? room => `www.l3tters.com/join?room=${room}` 
	: room => `localhost:3000/join?room=${room}`;


const Lobby = ({ socket, username, room, players, activePlayer, display }) => {
	
	const [shareLobbyByEmail] = useMutation(SHARE_LOBBY_BY_EMAIL);
	
	const onShare = async () => {
		//sends the email once the 'to' field has been filled
		//clicking the button should open up a modal first
		console.log('share');
		
		if (navigator.share) {
			console.log('can share');
			navigator.share({
				url: url(room);
			}
		}
		
		console.log(url(room));
		
		
		
		
		
		
		// to be filled by user -> MUST VALIDATE		
		// const to = [
			// 'chrismasters_326@outlook.com',
		
		// ];
		
		// try {
			// to.forEach(email => {
				// if (!validateEmail(email))
					// throw `Invalid email - ${email}`;
			// });
			// const response = await shareLobbyByEmail({ 
				// variables: {
					// room,
					// to
				// }
			// });
			// console.log(response.data.shareLobbyByEmail);
		// } catch (err) {
			// console.error(err);
		// };
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






					<div className="lobby">
						<p className="wotd-head">WORD OF THE DAY!!<span className="wotd">PLACEHOLDER</span><span className="bonus"> 5 bonus points if you find this word.</span></p>

						<div className="button-flex">

						<button className="lobby-btn"><img src={dollar} alt="Store"/><span>Store</span></button>

						<button className="lobby-btn"><img src={settings} alt="Settings"/><span>Settings</span></button>

						<button className="lobby-btn" onClick={onShare}><img src={share} alt="Invite"/><span>Invite</span></button>

						{/* <button className="lobby-btn"><img src={friend} alt="Friends"/><span>Friends</span></button> */}
							<Friends socket={socket} username={username} room={room} />
						</div>

						<p className="swipe-arrows">Swipe to play <span className="arrow-image"><img src={swipeRight} alt="right arrow"/></span></p>
					</div>


			</div>
		</div>
  );
};

export default Lobby;
