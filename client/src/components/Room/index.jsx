import React, { useState, useEffect } from "react";
import MW from "../../assets/images/Merriam-Webster.png";
import Lobby from '../Lobby';
import MainGame from "../MainGame";
import NumbersGame from "../NumbersGame";
import Winner from "../Winner";
import LiveChat from "../LiveChat";

const MAX_ROUNDS = 6;	//this could be a game setting
const DEVELOP = false;

function Room({ 
	socket, 
	username, 
	setUsername, 
	room, 
	setRoom,
	loggedIn, 
	jwt,
	dailyHints,
	setDailyHints,
	isMobile,
	display,
	width,
	height
}) {
  const [players, setPlayers] = useState([]);
  const [activeTimer, setActiveTimer] = useState("IDLE");
  const [isYourTurn, setTurn] = useState(false);
  const [round, setRound] = useState(1);
  const [activePlayer, setActivePlayer] = useState("");
  const [score, setScore] = useState(0);
	
  useEffect(() => {
    socket.on("send-players", generatePlayerList);
    socket.on("your-turn", () => setTurn(true));
    socket.on("new-round", updateRound);
    socket.on("set-game-state-room", setGameState);
		socket.on("update-username", (newUsername) => setUsername(newUsername));
		
	//eslint-disable-next-line
  }, [socket]);
	
  useEffect(() => {
    if (isYourTurn) document.body.classList.add("your-turn");
    else document.body.classList.remove("your-turn");
  }, [isYourTurn]);
	
  const generatePlayerList = async (playersArr, turn) => {
    setPlayers(playersArr);
    setActivePlayer(playersArr[turn].username);
  };

  const nextRound = () => {
		if (isYourTurn) {
			socket.emit("update-scores", room);
			setTimeout(() => socket.emit("next-round", room), 7000);
		}
  };
	
	const nextRoundBtn = () => {
		//this is only for dev. eventually that button will go away entirely
		socket.emit("update-scores", room);
		socket.emit("next-round", room);
	}
	
	const updateRound = newRound => {
		setRound(newRound);
		setActiveTimer("IDLE");
	}

  const restartGame = (event) => {
    socket.emit("restart-game", room);
    setActiveTimer(false);
  };

  const setGameState = (round) => {
		setRound(round);
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
					room={room}
					players={players}
					activePlayer={activePlayer}
					display={setLobbyDisplay()}
				/>

				<div className={`view ${setGameDisplay()}`}>
					{round <= MAX_ROUNDS ? 
						round % 2 ? (
							<MainGame
								socket={socket}
								username={username}
								room={room}
								activeTimer={activeTimer}
								setActiveTimer={setActiveTimer}
								isYourTurn={isYourTurn}
								setTurn={setTurn}
								score={score}
								setScore={setScore}
								loggedIn={loggedIn}
								jwt={jwt}
								dailyHints={dailyHints}
								setDailyHints={setDailyHints}
								display={setGameDisplay()}
								timerCompleteHandler={nextRound}
							/>
						) : (
							<NumbersGame
								socket={socket}
								username={username}
								room={room}
								activeTimer={activeTimer}
								setActiveTimer={setActiveTimer}
								isYourTurn={isYourTurn}
								setTurn={setTurn}
								score={score}
								setScore={setScore}
								loggedIn={loggedIn}
								jwt={jwt}
								dailyHints={dailyHints}
								setDailyHints={setDailyHints}
								display={setGameDisplay()}
								timerCompleteHandler={nextRound}
							/>
						)
					: (
						<Winner 
							usernames={getWinner()} 
							width={width}
							height={height}
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
					socket={socket} 
					username={username} 
					room={room} 
					display={setChatDisplay()}
				/>
			</div>
    </>
  );
}

export default Room;
