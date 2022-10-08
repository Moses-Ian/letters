/*
	HOW THIS WORKS:
	When the user clicks the button, the socket emits 'join-queue'. The server puts the socket in a queue. When the server is ready, it emits 'tell-room', passing the room name as data. The component's socket then emits 'join-game', passing the relevant data. 'onJoin' is a callback function that handles the returned data from the server. Once that function is run, the user is in the game.
	When the user closes the modal, the socket listener for 'tell-room' is turned off. when they open it again, it's turned back on. Is this the simplest way to deal with the issue? idk but it works.
*/
import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useL3ttersContext } from "../../utils/GlobalState";
import { useStopwatch } from 'react-timer-hook';

export default function QuickMatch() {
	
	const { 
		socket,
		room,
		username,
		setUsername,
		usernameReady,
		setRoom,
		setTurn,
		setRound,
	} = useL3ttersContext();
	
  const [show, setShow] = useState(false);
	const { seconds, minutes, pause, reset } = useStopwatch({ autoStart: false });
	
  const joinRoom = (name) => {
		console.log('should join room...');
    socket.emit("join-game", name, room, username, {visible: false}, onJoin);
		console.log('...did join room');
  };
	
	const onJoin = (success, newRoom, turn, round, newUsername) => {
		setRoom(newRoom);
		setTurn(turn);
		setRound(round);
		if (newUsername !== username) setUsername(newUsername);
		localStorage.setItem("room", newRoom);
	};

	useEffect(() => {
		if (!socket) return;
		if (!usernameReady) return;
		if (!show) return;
		socket.on('tell-room', joinRoom);
	//eslint-disable-next-line
	}, [socket, usernameReady, show]); 

	const joinQueue = () => {
		socket.emit("join-queue");
	}
	
	const openModal = () => {
		joinQueue();
		reset();
		setShow(true);
	}
	
	const closeModal = () => {
		socket.emit("leave-queue");
		socket.off('tell-room');
		pause();
		setShow(false);
	}
	
	if (!show) return (
		<div className="field has-text-centered">
			<button
				className="l3tters-btn is-warning p-2"
				onClick={openModal}
			>
				Quick Match
			</button>
		</div>
	)
	
	console.log(show);

	return (
		<form>
			<Modal title="Quick Match" submitText="Enter Game" hideEnterButton={true} onClose={closeModal}>
				<p>
					Waiting for opponent...
				</p>
				
				<p>
					{minutes === 0 ? '' : `${minutes}:`}{seconds}
				</p>
			</Modal>
		</form>
	)
}
