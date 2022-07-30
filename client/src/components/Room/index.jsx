import React, { useState, useEffect, useCallback } from "react";
import MW from "../../assets/images/Merriam-Webster.png";
import Lobby from '../Lobby';
import MainGame from "../MainGame";
import NumbersGame from "../NumbersGame";
import Winner from "../Winner";
import LiveChat from "../LiveChat";
import { useL3ttersContext } from "../../utils/GlobalState";

const ROUND_DELAY = 7000;
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
		loggedIn, 
		jwt,
		dailyHints,
		saveToken,
		display,
		isYourTurn,
		setTurn,
		round,
		setRound
	} = useL3ttersContext();
	
	
	
	
  const [players, setPlayers] = useState([]);
  const [activeTimer, setActiveTimer] = useState("IDLE");
  const [activePlayer, setActivePlayer] = useState("");
	
  useEffect(() => {
		socket.on("set-lobby", setLobby);
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
	
  const generatePlayerList = async (playersArr, turn) => {
    setPlayers(playersArr);
    setActivePlayer(playersArr[turn].username);
  };

  const nextRound = useCallback(() => {
		if (isYourTurn) {
			socket.emit("update-scores", room);
			setTimeout(() => socket.emit("next-round", room), ROUND_DELAY);
		}
	//eslint-disable-next-line
  }, [isYourTurn]);
	
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
	
	const leaveRoom = () => {
		socket.emit("leave-game", room, () => setRoom(''));
		localStorage.removeItem('room');
	}
	
  return (
    <>
			<div className="room">
			
				<button className="modal-toggle-button is-warning leave-button" onClick={leaveRoom}>
					Leave
				</button>
					
				<Lobby
					players={players}
					activePlayer={activePlayer}
					display={setLobbyDisplay()}
				/>

				<div className={`view ${setGameDisplay()}`}>
					{round <= MAX_ROUNDS ? 
						round % 2 ? (
							<MainGame
								activeTimer={activeTimer}
								setActiveTimer={setActiveTimer}
								display={setGameDisplay()}
								timerCompleteHandler={nextRound}
							/>
						) : (
							<NumbersGame
								activeTimer={activeTimer}
								setActiveTimer={setActiveTimer}
								display={setGameDisplay()}
								timerCompleteHandler={nextRound}
							/>
						)
					: (
						<Winner 
							usernames={getWinner()} 
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
							<div className="webster is-flex is-justify-content-flex-end">
								<img className="MW" src={MW} alt="Merriam Webster API" />
							</div>
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
