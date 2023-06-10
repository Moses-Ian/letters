import React, { useState, useReducer, useEffect } from "react";
import Modal from "../Modal";
import { sanitize } from "../../utils";
import { useL3ttersContext } from "../../utils/GlobalState";
// this might make the webpack much bigger -> we might want to store this in indexdb or something
let words = require('../../utils/words_9');

export default function JoinGame() {
	
	const { 
		socket,
		username, 
		setUsername,
		usernameReady, 
		room, 
		setRoom, 
		setTurn,
		setRound
	} = useL3ttersContext();
	
  const [show, setShow] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const [roomList, setRoomList] = useReducer(roomReducer, []);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function roomReducer(roomList, action) {
    let newRoomList;
    switch (action.type) {
      case "SET":
        newRoomList = [...action.rooms];
        break;
      default:
        throw new Error();
    }
    return newRoomList;
  }

	useEffect(() => {
		if (!socket) return;
		if (!usernameReady) return;
		// eslint-disable-next-line
		const path = joinRoomOnLoad();
		if (path === "nopath")
			socket.emit('list-rooms', listRooms);
		// if we don't want the room on refresh function, comment the if block
		// if (path === "nopath") {
      // const savedRoom = localStorage.getItem("room");
      // if (savedRoom) joinRoom(savedRoom);
		// }
		let randomWord = words[Math.floor(Math.random() * words.length)];
		setRoomInput(randomWord);
	// eslint-disable-next-line
	}, [socket, usernameReady]);
	
	const joinRoomOnLoad = () => {
		if (document.location.pathname !== '/join') return "nopath";
		const params = document.location.search.slice(1).split('&');
		const query = params.reduce(
			(result, element) => {
				const [key, value] = element.split('=');
				if (!key || !value) return result;
				result[key] = value;
				return result;
			},
			{}
		);
		if (query.room) joinRoom(query.room);
	};
	
	const openModal = () => {
		setShow(true);
	}
	
	const listRooms = (rooms) => {
		if(rooms.length !== 0)
			setRoomList({
				type: 'SET', 
				rooms
			});
	}
	
	const handleSelectedRoomChange = e => {
		setSelectedRoom(e.target.value);
	}

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setRoomInput(inputValue);
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    let r = sanitize(roomInput);
    if (r !== "" && r !== room) joinRoom(r);
    if (selectedRoom) joinRoom(selectedRoom);
    setShow(false);
  };

  const joinRoom = (name) => {
    socket.emit("join-game", name, room, username, {}, onJoin);
  };
	
	const onJoin = (success, newRoom, turn, round, newUsername) => {
		setRoom(newRoom);
		setTurn(turn);
		setRound(round);
		if (newUsername !== username) setUsername(newUsername);
		localStorage.setItem("room", newRoom);
	};

	if (!show) return (
		<div className="field has-text-centered">
			<button
				className="l3tters-btn is-warning p-2"
				onClick={openModal}
			>
				Join as {username}
			</button>
		</div>
	)

	return (
		<form onSubmit={joinRoomHandler}>
			<Modal title="Join Game" submitText="Enter Game" onClose={() => setShow(false)}>
				<p>
					What is the name of the room you would like to join?
				</p>
				
				{roomList.length !== 0
				?	(<div className="room-list m-2">
					{roomList.map((room, index) => (
						<div className="room-list-div" key={room.name}>
							<input 
								className="room-list-radio"
								type='radio' 
								name='joinroom' 
								id={room.name}
								value={room.name}
								checked={selectedRoom === room.name} 
								onChange={handleSelectedRoomChange}
							/>
							<label className="room-list-label pl-2 pt-1 pb-1" htmlFor={room.name}>
								{room.name}
								<div className="room-list-label-border" />
							</label>
						</div>
					))}
				</div>	
				) : (
					<p className='mt-3 mb-3'>
						There are currently no active games. Create one!
					</p>)
				}
				
				<input
					autoFocus
					className="type-box input mt-2"
					type="text"
					placeholder="Type room name"
					onChange={handleInputChange}
					value={roomInput}
				/>
			</Modal>
		</form>
	)
}
