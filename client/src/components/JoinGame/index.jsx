import React, { useState, useReducer } from "react";
import "../../App.css";
import { sanitize } from "../../utils";

export default function JoinGame({ socket, username, room, setRoom }) {
  const [show, setShow] = useState(false);
  const [roomInput, setRoomInput] = useState("");
	const [roomList, setRoomList] = useReducer(roomReducer, []);
	const [selectedRoom, setSelectedRoom] = useState(null);
	
	function roomReducer(roomList, action) {
		let newRoomList;
		switch (action.type) {
			case 'SET':
				newRoomList = [...action.rooms];
				break;
			default:
				throw new Error();
		}
		return newRoomList;
	}

  // if we don't want the room on refresh function, comment the useEffect
  // useEffect(() => {
  //   if (socket) {
  //     const savedRoom = localStorage.getItem("room");
  //     if (savedRoom) joinRoom(savedRoom);
  //   }
  // }, [socket]);
	
	const openModal = () => {
		socket.emit('list-rooms', listRooms);
		setShow(true);
	}
	
	const listRooms = (rooms) => {
		if(rooms.length != 0)
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
		console.log(e);
    let r = sanitize(roomInput);
    if (r !== "" && r !== room) joinRoom(r);
		if (selectedRoom) joinRoom(selectedRoom);
    setShow(false);
  };

  const joinRoom = (name) => {
    socket.emit("join-game", name, room, username, (success, newRoom) => {
      setRoom(newRoom);
      localStorage.setItem("room", newRoom);
    });
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setShow(false);
  };
	
	console.log(selectedRoom);

  return (
    <>
      <div className="field has-text-centered">
				<button
					className="join-game-button is-warning"
					onClick={openModal}
				>
					Join as {username}
				</button>
      </div>

      {show ? (
        <div className="modal-main" onClick={closeModal}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 className="modal-title">Join Game</h4>
            </div>
            <div className="modal-body">
              <p className="join-modal-body">
                What is the name of the room you would like to join?
              </p>
							
							{roomList.length !== 0
							?	(<>
								{roomList.map((room, index) => (
									<label className="radio mt-2" key={index}>
										<input 
											type='radio' 
											name={room.name} 
											value={room.name}
											checked={selectedRoom === room.name} 
											onChange={handleSelectedRoomChange}
										/>
										{room.name}
									</label>
								))}
							</>)
							: (<p className='join-modal-body mt-3 mb-3'>
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
            </div>
            <div className="modal-footer">
              <input
                type="submit"
                className="modal-enter-button"
                value="Enter Game"
                onClick={joinRoomHandler}
              />
              <button className="modal-close-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </form>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
