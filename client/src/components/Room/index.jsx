import React, { useState, useEffect } from "react";
import Lobby from '../Lobby';
import MainGame from "../MainGame";
import NumbersGame from "../NumbersGame";
import Winner from "../Winner";
import LiveChat from "../LiveChat";
import Menu from "../Menu"
import Players from "../Players";
import { useL3ttersContext } from "../../utils/GlobalState";

const MAX_ROUNDS = 6;	//this could be a game setting
const DEVELOP = true;

function Room() {
	
	const { 
		isMobile, 
		socket,
		username, 
		setUsername, 
		room, 
		setRoom,
		display,
		isYourTurn,
		setTurn,
		round,
		setRound
	} = useL3ttersContext();
	
  const [players, setPlayers] = useState([]);
  const [activeTimer, setActiveTimer] = useState("IDLE");
  const [activePlayer, setActivePlayer] = useState("");
	const [submissions, setSubmissions] = useState([]);
	
  useEffect(() => {
		socket.on("set-lobby", setLobby);
		socket.on("send-submissions", updateSubmissions);
    socket.on("send-players", generatePlayerList);
    socket.on("your-turn", () => setTurn(true));
    socket.on("new-round", updateRound);
		socket.on("update-username", (newUsername) => setUsername(newUsername));
		
	//eslint-disable-next-line
  }, [socket]);
	
  useEffect(() => {
    if (isYourTurn) document.body.classList.add("your-turn");
    else document.body.classList.remove("your-turn");
  }, [isYourTurn]);
	
	const setLobby = (newRound, newPlayers, newTurn) => {
		setRound(newRound);
		setPlayers(newPlayers);
		setActivePlayer(newPlayers[newTurn].username);
		setTurn(newPlayers[newTurn].username === username);
		setActiveTimer("IDLE");
	}
	
	const updateSubmissions = submissionsArr => {
		setSubmissions(submissionsArr);
		console.log(submissionsArr);
	};
	
  const generatePlayerList = async (playersArr, turn) => {
    setPlayers(playersArr);
    setActivePlayer(playersArr[turn].username);
  };

	const nextRoundBtn = () => {
		//this is only for dev.
		socket.emit("update-scores", room);
		socket.emit("next-round", room);
	}
	
	const updateRound = (newRound, activeUsername) => {
		setRound(newRound);
		setTurn(activeUsername === username);
		setActivePlayer(activeUsername);
		setActiveTimer("IDLE");
	}

  const restartGame = (event) => {
    socket.emit("restart-game", room);
    setActiveTimer(false);
  };

	const setLobbyDisplay = () => {
		if (!isMobile || display==='lobby')
			return 'active-view';
		return 'inactive-view-left';
	}
	
	const setGameDisplay = () => {
		if (!isMobile || display === 'game')
			return 'active-view';
		if (display === 'lobby')
			return 'inactive-view-right';
		if (display === 'chat')
			return 'inactive-view-left';
	}
	
	const setChatDisplay = () => {
		if (!isMobile || display==='chat')
			return 'active-view';
		return 'inactive-view-right';
	}
	
	const getWinner = () => {
		let topScore = 0;
		let best = [];
		for(let i=0; i<players.length; i++) {
			if (players[i].score > topScore) {
				topScore = players[i].score;
				best = [i];
			} else if (players[i].score === topScore) {
				best.push(i);
			}
		}
		return best.map(index => players[index].username);
	}
	

  return (
    <>
			<div className="room">
			
<<<<<<< HEAD
			
				
				{isMobile ?          
				<Lobby
					socket={socket}
					username={username}
					room={room}
=======
				<button className="modal-toggle-button is-warning leave-button" onClick={leaveRoom}>
					Leave
				</button>
				{/* <button className="modal-toggle-button is-warning menu-button">Menu</button> */}
					
				{/* <Lobby
>>>>>>> b6cddabbd7d8ac0aea6e222dce3347482a6572ce
					players={players}
					activePlayer={activePlayer}
					display={setLobbyDisplay()}
				/> 
			:
				<Menu 
					socket={socket}
					username={username}
					room={room}
					players={players}
					activePlayer={activePlayer}
					display={setLobbyDisplay()}
					setRoom={setRoom}
					deleteToken={deleteToken}
					loggedIn={loggedIn}
				/>
				}	

		
				<div className={`view ${setGameDisplay()}`}>
				
					<Players players={players} activePlayer={activePlayer} />
				
					{round <= MAX_ROUNDS ? 
						round % 2 ? (
							<MainGame
								activeTimer={activeTimer}
								setActiveTimer={setActiveTimer}
								display={setGameDisplay()}
							/>
						) : (
							<NumbersGame
								activeTimer={activeTimer}
								setActiveTimer={setActiveTimer}
							/>
						)
					: (
						<Winner 
							usernames={getWinner()} 
<<<<<<< HEAD
							width={width}
							height={height}	
=======
>>>>>>> b6cddabbd7d8ac0aea6e222dce3347482a6572ce
						/>
					)}
					{DEVELOP &&
						<div className="m-3 has-text-centered is-flex is-justify-content-center">
							<button className="button is-warning m-2" onClick={restartGame}>
								Restart
							</button>

							<button className="button is-warning m-2" onClick={nextRoundBtn}>
								Next Round
							</button>
						</div>
					}
				</div>

				<LiveChat 
					display={setChatDisplay()}
				/>
			</div>
    </>
  );
}

export default Room;
